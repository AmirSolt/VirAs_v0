import { client, twilioPageId } from "../clients/twilio";
import { twiml } from "twilio";
import express, { Request, Response } from 'express';
import { submitMessage } from "../services/communications";
import { getProfile } from "../services/db";
import { callCompletion } from "../services/assistance";


export const messengerRouter = express.Router()
messengerRouter.use(express.urlencoded({ extended: false }));



messengerRouter.post('/inbound', async (req: Request, res: Response) => {
    const twimlResponse = new twiml.MessagingResponse();
    console.log("--- recieved fb messenger")
    const body = req.body.Body
    const fromFBId = req.body.From
    // call categorizer
    // sendMessage(req.body.From, req.body.Body).catch(error => console.error("Error sending fb messenger:", error));
    
    let profile = await getProfile(fromFBId)

    if(profile == null){
        // create profile
        // send welcome messages
        return res.type('text/xml').send(twimlResponse.toString());
    }

    if(profile._count.messages>0 && profile._count.messages % 100 == 0){
        // send disclaimer
    }

    callCompletion(req.app.locals.config, profile)

    
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
    // submitMessage()

    res.type('text/xml').send(twimlResponse.toString());
});





