import { client, twilioPageId } from "../clients/twilio";
import { twiml } from "twilio";
import express, { Request, Response } from 'express';


export const messengerRouter = express.Router()
messengerRouter.use(express.urlencoded({ extended: false }));



messengerRouter.post('/inbound', (req: Request, res: Response) => {
    const twimlResponse = new twiml.MessagingResponse();
    console.log("--- recieved fb messenger")
    console.log(JSON.stringify(req))
    sendMessage(req.body.From, req.body.Body).catch(error => console.error("Error sending fb messenger:", error));
    res.type('text/xml').send(twimlResponse.toString());
});

// messengerRouter.get('/outbound', (req: Request, res: Response) => {
//     console.log("--- fb messenger sent")
//     sendMessage(req.body.From, `Outbound`).catch(error => console.error("Error sending fb messenger:", error));
//     res.redirect('/');
// });

messengerRouter.post('/inbound/fail', (req: Request, res: Response) => {
    const twimlResponse = new twiml.MessagingResponse();
    console.log("---  fb messenger failed")
    console.log(`request: ${req}`)
    console.log("-------------------")

    res.type('text/xml').send(twimlResponse.toString());
});




async function sendMessage(sendTo:string, text:string): Promise<void> {
    if (twilioPageId) {
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
    } else {
        console.error("You are missing one of the variables needed to send a message");
    }
}

