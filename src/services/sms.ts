import { Twilio, twiml} from "twilio";
import express, { Request, Response } from 'express';
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const client = new Twilio(accountSid, authToken);

export const smsRouter = express.Router()

smsRouter.get('/inbound', (req: Request, res: Response) => {
    const twimlResponse = new twiml.MessagingResponse();
    console.log("--- recieved sms")
    console.log(`-- body: ${req.body}`)

    res.type('text/xml').send(twimlResponse.toString());
});

smsRouter.get('/outbound', (req: Request, res: Response) => {
    sendSMS()
    res.redirect('/');
});

smsRouter.get('/inbound/fail', (req: Request, res: Response) => {
    const twimlResponse = new twiml.MessagingResponse();
    console.log("---  SMS failed")
    res.type('text/xml').send(twimlResponse.toString());
});




function sendSMS() {

    if (accountSid && authToken && twilioNumber) {
        client.messages
            .create({
                from: twilioNumber,
                to: "+16475807443",
                body: "You just sent an SMS from TypeScript using Twilio!",
            })
            .then((message) => console.log(message.sid));
    } else {
        console.error(
            "You are missing one of the variables you need to send a message"
        );
    }
}
