import { redis } from "../clients/redis";
import { Prisma } from "@prisma/client";

async function getRecord(table:Prisma.UserDelegate, key:string){

    let valueStr = await redis.get(key)

    if(valueStr){
        return JSON.parse(valueStr)
    }
    
    let value = await table.findFirst({
        where: {
            id: key,
        }
    })
    if(value){
        redis.set(key, JSON.stringify(value))
        return value
    }

    console.log("Not found in database")

    return null
}

async function setRecord(table:Prisma.UserDelegate, key:string, record:any){
    let value = await table.create({
        data: {
            key: record,
        }
    })
    redis.set(key, JSON.stringify(record))

    return null
}