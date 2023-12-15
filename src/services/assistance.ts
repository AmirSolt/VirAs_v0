import { Config, Message, MessageDir, MessageRole, Profile } from "@prisma/client";
import { openai } from "../clients/openai";
import { ChatCompletionMessageParam, ChatCompletionToolMessageParam } from "openai/resources";
import { toolsFunc, toolsObjects } from "./tools";
import { MProfile } from "../clients/prismaExtra";





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

    // push responseMessage to db
    // send message if has body

    const toolCalls = responseMessage.tool_calls;
    if (toolCalls == null) {
        return
    } else {
        Promise.allSettled(
            toolCalls.map(toolCall => {
                return async () => {

                    // function call
                    // push responseMessage to db
                    // send message if has body

                    const functionName = toolCall.function.name;
                    const functionToCall = toolsFunc[functionName];
                    // const functionArgs = JSON.parse(toolCall.function.arguments);
                    functionToCall();
                }
            })
        )
    }
}
