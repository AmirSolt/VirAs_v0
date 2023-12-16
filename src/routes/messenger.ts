import { client, twilioPageId } from "../clients/twilio";
import { twiml } from "twilio";
import express, { Request, Response } from 'express';
import { submitMessage } from "../services/communications";
import { createProfile, getProfile } from "../services/db";
import { callCompletion } from "../services/assistance";
import { ConfigType, Message, MessageDir, MessageRole, Config, Profile } from "@prisma/client";

// remind user of disclaimer after x messages
const disclaimerReminderMessageCount = 200


export const messengerRouter = express.Router()
messengerRouter.use(express.urlencoded({ extended: false }));


import { toolsFunc } from "../services/tools";

messengerRouter.post('/inbound', async (req: Request, res: Response) => {
    const twimlResponse = new twiml.MessagingResponse();
    console.log("--- recieved fb messenger")
    const body = req.body.Body
    const fromFBId = req.body.From
    // sendMessage(req.body.From, req.body.Body).catch(error => console.error("Error sending fb messenger:", error));
    

    let profile = await getProfile(fromFBId)
    
    // ****
    if(profile == null){
        profile = await createProfile(fromFBId)
    }
    if(body.toLowerCase()=="country"){
        toolsFunc["country"](profile, "CA")
    }
    if(body.toLowerCase()=="search"){
        toolsFunc["search"](profile, "headphones")
    }
    if(body.toLowerCase()=="report"){
        toolsFunc["report"](profile, "problem content test")
    }

    return res.type('text/xml').send(twimlResponse.toString());
    // ****


    // if(profile == null){
    //     profile = await createProfile(fromFBId)
    //     await submitMessage(profile, MessageRole.NON_AI, MessageDir.INBOUND, body)
    //     await submitMessage(profile, MessageRole.NON_AI, MessageDir.OUTBOUND, "Welcome to here, Disclaimer, Instruction")
    //     // submitMessage(profile, MessageRole.NON_AI, MessageDir.OUTBOUND, "Country")
    //     return res.type('text/xml').send(twimlResponse.toString());
    // }
    
    // await submitMessage(profile, MessageRole.USER, MessageDir.INBOUND, body)

    // console.log("--- user message saved")

    // if(profile._count.messages>0 && profile._count.messages % disclaimerReminderMessageCount == 0){
    //     submitMessage(profile, MessageRole.ASSISTANT, MessageDir.OUTBOUND, "Disclaimer")
    // }

    // callCompletion(req.app.locals.config, profile)

    // res.type('text/xml').send(twimlResponse.toString());
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





