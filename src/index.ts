import express, { Request, Response } from 'express';
import {messengerRouter} from './routes/messenger'


const app = express();
const port = process.env.PORT || 3000;


import { ConfigType, Message, Config } from "@prisma/client";
import { redis } from "./clients/redis";
import { prisma } from './clients/prisma';


app.use(async (req: Request, res: Response) => {

    // Fetch and cache 'Config', and save to locals
    await redis.get(ConfigType.FREE, async (err, res)=>{
        if (err) {
            const config = await prisma.config.findFirst({where:{id:ConfigType.FREE}})
            redis.set(ConfigType.FREE, JSON.stringify(config))
            app.locals.config = config
        } else {
            app.locals.config = res
        }
    })
})
    



app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express!');
});

app.use('/messenger', messengerRouter)


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
