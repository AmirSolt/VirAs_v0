import { Config, Message, MessageDir, MessageRole, Profile } from "@prisma/client";
import { openai } from "../clients/openai";
import { ChatCompletionMessageParam, ChatCompletionToolMessageParam } from "openai/resources";
import { toolsFunc, toolsObjects } from "./tools";
import { MProfile } from "../clients/prismaExtra";
import { submitMessage } from "./communications";





export async function callCompletion(config: Config, profile:MProfile):Promise<void> {

    const systemMessage: ChatCompletionMessageParam = {
        content: config.categorizer_system_message,
        role: "system"
    }

    const chatMessages = profile.messages.map(m => {

        if(m.role == MessageRole.TOOL){
            return {
                role: m.role.toLowerCase(),
                content: m.content,
                tool_call_id:m.tool_call_id
            } as ChatCompletionToolMessageParam
        }

        return {
            role: m.role.toLowerCase(),
            content: m.content,
        } as ChatCompletionMessageParam
    })

    chatMessages.unshift(systemMessage)

    const chatCompletion = await openai.chat.completions.create({
        messages: chatMessages,
        model: 'gpt-4-1106-preview',
        stream: false,
        temperature: config.categorizer_temperature,
        tool_choice: "auto",
        tools:toolsObjects
    });


    const responseMessage = chatCompletion.choices[0].message


    if (responseMessage.tool_calls) {
        await Promise.allSettled(
            responseMessage.tool_calls.map(toolCall => {
                return async () => {

                    submitMessage(
                        profile,
                        MessageRole.ASSISTANT,
                        MessageDir.OUTBOUND,
                        responseMessage.content,
                        toolCall.id,
                        toolCall.function.name,
                    )

                    const functionName = toolCall.function.name;
                    const functionToCall = toolsFunc[functionName];
                    // const functionArgs = JSON.parse(toolCall.function.arguments);
                    await functionToCall(profile);
                }
            })
        )
    }else{
        submitMessage(
            profile,
            MessageRole.ASSISTANT,
            MessageDir.OUTBOUND,
            responseMessage.content,
            null,
            null,
        )
    }
}
