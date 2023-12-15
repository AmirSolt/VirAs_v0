import { Config, Message, MessageDir, Profile } from "@prisma/client";
import { openai } from "../clients/openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { toolsFunc, toolsObjects } from "./tools";






export async function callCompletion(config: Config, profile:(Profile & {messages: Message[];} & {_count:{messages:number}})):Promise<void> {

    const systemMessage: ChatCompletionMessageParam = {
        content: config.categorizer_system_message,
        role: "system"
    }

    const chatMessages = profile.messages.map(m => {
        return {
            role: m.role.toLowerCase(),
            content: m.body
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
