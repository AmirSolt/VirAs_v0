import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;


app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express!');
});


import { sendSMS } from './services/messaging';

app.get('/send', (req: Request, res: Response) => {
    // sendSMS()
    console.log("Send activated")
    res.redirect('/');
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});