import { Twilio, twiml } from "twilio";


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
export const twilioPageId = process.env.TWILIO_MESSENGER_PAGE_ID;
export const client = new Twilio(accountSid, authToken);