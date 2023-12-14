import { Config, Message, MessageDir } from "@prisma/client";
import { openai } from "../clients/openai";
import { ChatCompletionMessageParam, ChatCompletionTool } from "openai/resources";




const tools: ChatCompletionTool[] = [{
    type: "function",
    function: {
        name: "getCurrentWeather",
        description: "Get the weather in location",
        parameters: {
            type: "object",
            properties: {
                location: { type: "string", description: "The city and state e.g. San Francisco, CA" },
                unit: { type: "string", enum: ["c", "f"] }
            },
            required: ["location"]
        }
    }
}]

const availableFunctions: Record<string, any> = {
    get_current_weather: () => { },
};


export async function getCompletion(config: Config, messages: Message[]) {

    const systemMessage: ChatCompletionMessageParam = {
        content: config.categorizer_system_message,
        role: "system"
    }

    const chatMessages = messages.map(m => {
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
        tools
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
                    const functionName = toolCall.function.name;
                    const functionToCall = availableFunctions[functionName];
                    const functionArgs = JSON.parse(toolCall.function.arguments);
                    const functionResponse = functionToCall(
                        functionArgs.location,
                        functionArgs.unit
                    );

                    // function call
                    // push responseMessage to db
                    // send message if has body

                    // function response
                    // push responseMessage to db
                    // send message if has body
                }
            })
        )
    }
}
