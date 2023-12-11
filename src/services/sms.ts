import { Twilio, twiml} from "twilio";
import express, { Request, Response } from 'express';
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const client = new Twilio(accountSid, authToken);

export const smsRouter = express.Router()

smsRouter.post('/inbound', (req: Request, res: Response) => {
    const message = req.body.Body;
    const twimlResponse = new twiml.MessagingResponse();
    console.log("--- recieved sms")
    console.log(`-- body: ${message}`)
    sendSMS(message).catch(error => console.error("Error sending SMS:", error));
    res.type('text/xml').send(twimlResponse.toString());
});

smsRouter.get('/outbound', (req: Request, res: Response) => {
    console.log("--- sms sent")
    sendSMS("Outbound").catch(error => console.error("Error sending SMS:", error));
    res.redirect('/');
});

smsRouter.post('/inbound/fail', (req: Request, res: Response) => {
    const twimlResponse = new twiml.MessagingResponse();
    console.log("---  SMS failed")
    res.type('text/xml').send(twimlResponse.toString());
});




async function sendSMS(text:string): Promise<void> {
    if (accountSid && authToken && twilioNumber) {
        try {
            const message = await client.messages.create({
                from: twilioNumber,
                to: "+16475807443",
                body: text,
            });
            console.log("SMS sent with SID:", message.sid);
        } catch (error) {
            console.error("Failed to send SMS:", error);
        }
    } else {
        console.error("You are missing one of the variables needed to send a message");
    }
}