import OpenAI from 'openai';
import * as dotenv from 'dotenv'
dotenv.config()

if(process.env.OPENAI_API_KEY == null){
    throw new Error('missing OPENAI_API_KEY');
}


export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});

// async function main() {
//   const chatCompletion = await openai.chat.completions.create({
//     messages: [{ role: 'user', content: 'Say this is a test' }],
//     model: 'gpt-3.5-turbo',
//   });
// }

// main();