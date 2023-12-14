import { Twilio, twiml } from "twilio";
import * as dotenv from 'dotenv'
dotenv.config()


if(process.env.TWILIO_ACCOUNT_SID == null){
    throw new Error('missing TWILIO_ACCOUNT_SID');
}
if(process.env.TWILIO_AUTH_TOKEN == null){
    throw new Error('missing TWILIO_AUTH_TOKEN');
}

if(process.env.TWILIO_MESSENGER_PAGE_ID == null){
    throw new Error('missing TWILIO_MESSENGER_PAGE_ID');
}


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
export const twilioPageId = process.env.TWILIO_MESSENGER_PAGE_ID;
export const client = new Twilio(accountSid, authToken);