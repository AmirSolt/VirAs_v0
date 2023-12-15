import { Config, Message, MessageDir, MessageRole, Profile } from "@prisma/client";
import { openai } from "../clients/openai";
import { ChatCompletionMessageParam, ChatCompletionToolMessageParam, ChatCompletionAssistantMessageParam, ChatCompletionMessageToolCall } from "openai/resources";
import { toolsFunc, toolsObjects } from "./tools";
import { MProfile } from "../clients/prismaExtra";
import { submitMessage } from "./communications";





export async function callCompletion(config: Config, profile: MProfile): Promise<void> {

    const systemMessage: ChatCompletionMessageParam = {
        content: config.categorizer_system_message,
        role: "system"
    }

    const chatMessages = profile.messages.filter(m => m.role != MessageRole.NON_AI).map(m => {
        if (m.role == MessageRole.TOOL) {
            return {
                role: m.role.toLowerCase(),
                content: m.content ?? "",
                tool_call_id: m.extra_json
            } as ChatCompletionToolMessageParam
        }

        if (m.role == MessageRole.ASSISTANT && m.extra_json) {
            return {
                role: m.role.toLowerCase(),
                content: m.content ?? "",
                tool_calls: m.extra_json as unknown,
            } as ChatCompletionAssistantMessageParam
        }

        return {
            role: m.role.toLowerCase(),
            content: m.content ?? "",
        } as ChatCompletionMessageParam
    })

    chatMessages.unshift(systemMessage)

    console.log(chatMessages)


    const chatCompletion = await openai.chat.completions.create({
        messages: chatMessages,
        model: 'gpt-4-1106-preview',
        stream: false,
        temperature: config.categorizer_temperature,
        tool_choice: "auto",
        tools: toolsObjects
    });

    const responseMessage = chatCompletion.choices[0].message

    await submitMessage(
        profile,
        MessageRole.ASSISTANT,
        MessageDir.OUTBOUND,
        responseMessage.content,
        responseMessage.tool_calls,
    );




    console.log("--- assistance message sent")

    if (responseMessage.tool_calls) {

        // * running tool messages first because OPENAI devs are dumb as bricks
        await Promise.allSettled(
            responseMessage.tool_calls.map(toolCall => (async () => {

                await submitMessage(
                    profile,
                    MessageRole.TOOL,
                    MessageDir.OUTBOUND,
                    "Data delivered",
                    toolCall.id,
                );
            })())
        );



        await Promise.allSettled(
            responseMessage.tool_calls.map(toolCall => (async () => {
                // missing await added before the submitMessage
                console.log("--- tool call running:");
                const functionName = toolCall.function.name;
                const functionToCall = toolsFunc[functionName];
                // const functionArgs = JSON.parse(toolCall.function.arguments);
                // await functionToCall(profile, ...functionArgs);
                await functionToCall(profile);

            })())
        );
    }
}
