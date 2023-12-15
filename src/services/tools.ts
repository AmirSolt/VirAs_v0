import { ChatCompletionTool } from "openai/resources";
import { submitMessage } from "./communications";
import { MProfile } from "../clients/prismaExtra";
import { MessageDir, MessageRole } from "@prisma/client";

export const toolsObjects: ChatCompletionTool[] = [
    {
        type: "function",
        function: {
            name: "tool1",
            description: "Run when user asks you to run tool1",
            parameters: {
                type: "object",
                properties: {
                },
            }
        }
    },
    {
        type: "function",
        function: {
            name: "tool2",
            description: "Run when user asks you to run tool2",
            parameters: {
                type: "object",
                properties: {
                },
            }
        }
    },
    // {
    //     type: "function",
    //     function: {
    //         name: "getCurrentWeather",
    //         description: "Get the weather in location",
    //         parameters: {
    //             type: "object",
    //             properties: {
    //                 location: { type: "string", description: "The city and state e.g. San Francisco, CA" },
    //                 unit: { type: "string", enum: ["c", "f"] }
    //             },
    //             required: ["location"]
    //         }
    //     }
    // }
]

export const toolsFunc: Record<string, any> = {
    tool1: async (profile:MProfile) => {

        const content = "Tool1 is working"

        console.log(content)


        submitMessage(
            profile,
            MessageRole.ASSISTANT,
            MessageDir.OUTBOUND,
            content,
        );
    },
    tool2: async (profile:MProfile) => {

        const content = "Tool2 is working"

        console.log(content)

        submitMessage(
            profile,
            MessageRole.ASSISTANT,
            MessageDir.OUTBOUND,
            content,
        )
    }
};