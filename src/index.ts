import express, { Request, Response } from 'express';
import {messengerRouter} from './services/messenger'


const app = express();
const port = process.env.PORT || 3000;


app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express!');
});


app.use('/messenger', messengerRouter)


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
