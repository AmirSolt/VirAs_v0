import { Twilio, twiml } from "twilio";
import express, { Request, Response } from 'express';
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const client = new Twilio(accountSid, authToken);

export const smsRouter = express.Router()
smsRouter.use(express.urlencoded({ extended: false }));


const exampleSendTo = "+16475807443"
const exampleMediaUrl = "https://m.media-amazon.com/images/I/61rowppY2TL._AC_SL1500_.jpg"

smsRouter.post('/inbound', (req: Request, res: Response) => {
    const twimlResponse = new twiml.MessagingResponse();
    console.log("--- recieved sms")
    sendMessage(exampleSendTo, req.body.Body).catch(error => console.error("Error sending SMS:", error));
    res.type('text/xml').send(twimlResponse.toString());
});

smsRouter.get('/outbound', (req: Request, res: Response) => {
    console.log("--- sms sent")
    sendMessage(exampleSendTo, "Outbound", [exampleMediaUrl]).catch(error => console.error("Error sending SMS:", error));
    res.redirect('/');
});

smsRouter.post('/inbound/fail', (req: Request, res: Response) => {
    const twimlResponse = new twiml.MessagingResponse();
    console.log("---  SMS failed")
    console.log(`request: ${req}`)
    console.log("-------------------")

    res.type('text/xml').send(twimlResponse.toString());
});




async function sendMessage(sendTo:string, text:string, mediaUrl:string[]|undefined=undefined): Promise<void> {
    if (accountSid && authToken && twilioNumber) {
        try {
            const message = await client.messages.create({
                from: twilioNumber,
                to: sendTo,
                body: text,
                mediaUrl:mediaUrl,
            });
            console.log("SMS sent with SID:", message.sid);
        } catch (error) {
            console.error("Failed to send SMS:", error);
        }
    } else {
        console.error("You are missing one of the variables needed to send a message");
    }
}