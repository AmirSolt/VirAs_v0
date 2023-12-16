import { client, twilioPageId, TWILIO_PHONE_NUMBER, ADMIN_NUMBER } from "../clients/twilio";
import { createMessage, createTicket } from "./db";
import { ConfigType, Message, MessageDir, MessageRole, Config, Profile, Ticket } from "@prisma/client";
import { MProfile } from "../clients/prismaExtra";


const messageCharLimit = 400


export async function submitMessage(
    profile: MProfile,
    role:MessageRole,
    messageDir:MessageDir,
    content: string | null | undefined = undefined,
    extra_json: any|undefined|null=undefined):Promise<MProfile> {

    if(messageDir===MessageDir.INBOUND && content && content.length >= messageCharLimit && role!==MessageRole.TOOL){
        const newContent = `Sorry, but your message exceeds ${messageCharLimit} characters`
        sendMessage(profile.fb_messenger_id, newContent)
        return await createMessage(
            profile,
            role,
            messageDir,
            newContent,
            extra_json
        )
    }


    if(messageDir===MessageDir.OUTBOUND && content && role!==MessageRole.TOOL){
        sendMessage(profile.fb_messenger_id, content.substring(0, messageCharLimit))
    }

    return await createMessage(
        profile,
        role,
        messageDir,
        content?.substring(0, messageCharLimit),
        extra_json
    )
}



export async function submitTicket(
    profile: MProfile,
    content: string):Promise<Ticket> {

    sendSMS(ADMIN_NUMBER, "--- Ticket: \n"+content)

    return await createTicket(profile, content)
}







async function sendMessage(sendTo: string, text: string): Promise<void> {


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



async function sendSMS(sendTo: string, text: string): Promise<void> {
    try {
        const message = await client.messages.create({
            from: TWILIO_PHONE_NUMBER,
            body: text,
            to: sendTo,
        });
        console.log("SMS sent with SID:", message.sid);
    } catch (error) {
        console.error("Failed to send sms:", error);
    }
}

