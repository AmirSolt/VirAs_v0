import { client, twilioPageId } from "../clients/twilio";
import { createMessage } from "./db";
import { ConfigType, Message, MessageDir, MessageRole, Config, Profile } from "@prisma/client";
import { MProfile } from "../clients/prismaExtra";

export async function submitMessage(
    profile: MProfile,
    role:MessageRole,
    messageDir:MessageDir,
    content: string | null | undefined = undefined,
    extra_json: any|undefined|null=undefined):Promise<MProfile> {

    
    if(messageDir===MessageDir.OUTBOUND && content && role!==MessageRole.TOOL){
        sendMessage(profile.fb_messenger_id, content)
    }

    return await createMessage(
        profile,
        role,
        messageDir,
        content,
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

