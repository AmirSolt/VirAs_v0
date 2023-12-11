import { Twilio, twiml } from "twilio";
import express, { Request, Response } from 'express';
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const client = new Twilio(accountSid, authToken);

export const smsRouter = express.Router()
smsRouter.use(express.urlencoded({ extended: false }));


const exampleSendTo = "+16475807443"
const testRedirect = "https://verasv0-production.up.railway.app/sms/test"
const exampleAmazonUrl = "https://www.amazon.ca/NVIDIA-SHIELD-Android-Streaming-Performance/dp/B07YP9FBMM/?_encoding=UTF8&pd_rd_w=Etgh8&content-id=amzn1.sym.2fd36d35-e0d1-4258-ba0c-e42eba5f6561%3Aamzn1.symc.e5c80209-769f-4ade-a325-2eaec14b8e0e&pf_rd_p=2fd36d35-e0d1-4258-ba0c-e42eba5f6561&pf_rd_r=XDQN1V1RR4BN0J1WKXXV&pd_rd_wg=1rq9L&pd_rd_r=953faec6-ca17-41c6-9803-68cf8cac4d3c&ref_=pd_gw_ci_mcx_mr_hp_atf_m&th=1"

smsRouter.post('/inbound', (req: Request, res: Response) => {
    const twimlResponse = new twiml.MessagingResponse();
    console.log("--- recieved sms")
    sendMessage(exampleSendTo, req.body.Body).catch(error => console.error("Error sending SMS:", error));
    res.type('text/xml').send(twimlResponse.toString());
});

smsRouter.get('/outbound', (req: Request, res: Response) => {
    console.log("--- sms sent")
    sendMessage(exampleSendTo, `Outbound ${testRedirect}`).catch(error => console.error("Error sending SMS:", error));
    res.redirect('/');
});

smsRouter.post('/inbound/fail', (req: Request, res: Response) => {
    const twimlResponse = new twiml.MessagingResponse();
    console.log("---  SMS failed")
    console.log(`request: ${req}`)
    console.log("-------------------")

    res.type('text/xml').send(twimlResponse.toString());
});


smsRouter.post('/test', (req: Request, res: Response) => {
    res.redirect(exampleAmazonUrl);
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