import { client, twilioPageId } from "../clients/twilio";
import { twiml } from "twilio";
import express, { Request, Response } from 'express';
import { submitMessage } from "../services/communications";

export const messengerRouter = express.Router()
messengerRouter.use(express.urlencoded({ extended: false }));



messengerRouter.post('/inbound', (req: Request, res: Response) => {
    const twimlResponse = new twiml.MessagingResponse();
    console.log("--- recieved fb messenger")
    const body = req.body.Body
    const fromId = req.body.From
    // call categorizer
    // sendMessage(req.body.From, req.body.Body).catch(error => console.error("Error sending fb messenger:", error));
    
    
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

    // submit a message and say sorry
    submitMessage()

    res.type('text/xml').send(twimlResponse.toString());
});





