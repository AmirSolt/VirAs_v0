import { client, twilioPageId } from "../clients/twilio";
import { createMessage } from "./db";
import { ConfigType, Message, MessageDir, MessageRole, Config, Profile } from "@prisma/client";
import { MProfile } from "../clients/prismaExtra";


const maxCharLimit = 500


export async function submitMessage(
    profile: MProfile,
    role:MessageRole,
    messageDir:MessageDir,
    content: string | null | undefined = undefined,
    extra_json: any|undefined|null=undefined):Promise<MProfile> {

    if(messageDir===MessageDir.INBOUND && content && content.length >= maxCharLimit && role!==MessageRole.TOOL){
        const newContent = "Sorry, but your message exceeds 500 characters"
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
        sendMessage(profile.fb_messenger_id, content.substring(0, maxCharLimit))
    }

    return await createMessage(
        profile,
        role,
        messageDir,
        content?.substring(0, maxCharLimit),
        extra_json
    )
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

