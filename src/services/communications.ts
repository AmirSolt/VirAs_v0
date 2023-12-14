import { client, twilioPageId } from "../clients/twilio";


export async function submitMessage(sendTo:string, text:string){
    // save to db
    // if has content send to user
}


async function sendMessage(sendTo:string, text:string): Promise<void> {
    try {
        const message = await client.messages.create({
            from: `messenger:${twilioPageId}`,
            body: text,
            to: sendTo,
        });
        console.log("fb messenger sent with SID:", message.sid);
    } catch (error) {
        console.error("Failed to send fb messenger:", error);
    }
}

