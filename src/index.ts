import express, { Request, Response } from 'express';
import {messengerRouter} from './routes/messenger'


const app = express();
const port = process.env.PORT || 3000;


import { getConfig } from './services/db';

app.use(async (req: Request, res: Response, next) => {

    const config = await getConfig()

    if(config==null){
        throw new Error('Config could not be found')
    }else{
        app.locals.config = config
    }

    return next()
})
    

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express!');
});

app.use('/messenger', messengerRouter)


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


// 1. when assistant runs tool it does not log it correctly
// { role: 'assistant', content: '' },

// 2. you can ad intro role to message so filter out messages sent by default