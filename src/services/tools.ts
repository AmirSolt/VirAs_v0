import { ChatCompletionTool } from "openai/resources";

export const toolsObjects: ChatCompletionTool[] = [
    {
        type: "function",
        function: {
            name: "tool1",
            description: "To test tool function, only call if user asks to test the tool function",
            parameters: {
                type: "object",
                properties: {
                }
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
    tool1: async () => {
        // submit message if there's one
    }
};