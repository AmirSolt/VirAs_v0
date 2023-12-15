import { prisma } from "../clients/prisma";
import { ConfigType, Message, MessageDir, MessageRole, Config, Profile } from "@prisma/client";
import { redis } from "../clients/redis";
import type { MProfile } from "../clients/prismaExtra";

// expire redis records after x
const defaultRedisExpiration = 60*60

// fetch message history with profile
const lastMessagesFetched = 10


export async function createMessage(
    profile: MProfile,
    role:MessageRole,
    messageDir:MessageDir,
    content: string | null | undefined = undefined,
    tool_call_id: string | null | undefined = undefined,
    tool_call_name: string | null | undefined = undefined){

    const message = await prisma.message.create({
        data:{
            profile_id:profile.id,
            message_dir:messageDir,
            content,
            role,
            tool_call_id,
            tool_call_name,
        }
    }) 

    profile.messages.push(message)
    profile._count.messages++

    redis.set(profile.fb_messenger_id, JSON.stringify(profile), "EX", defaultRedisExpiration)

    return profile
}


export async function createProfile(fbMessengerId: string){
    const profile = await prisma.profile.create({
        data:{
            fb_messenger_id:fbMessengerId
        },
        include: {
            messages: {
                take: -lastMessagesFetched,
                orderBy: {
                    created_at: 'asc',
                },
            },
            _count: {
                select: { messages: true },
            },
        }
    })

    redis.set(fbMessengerId, JSON.stringify(profile), "EX", defaultRedisExpiration)

    return profile
}


export async function getProfile(fbMessengerId: string) {

    let profile:MProfile | null | undefined

    const res = await redis.get(fbMessengerId)
    
    if (res==null) {
        const profileValue = await prisma.profile.findFirst({
            where: {
                fb_messenger_id: fbMessengerId
            },
            include: {
                messages: {
                    take: -lastMessagesFetched,
                    orderBy: {
                        created_at: 'desc',
                    },
                },
                _count: {
                    select: { messages: true },
                },
            }
        })
        if(profileValue){
            redis.set(fbMessengerId, JSON.stringify(profileValue), "EX", defaultRedisExpiration)
            profile = profileValue
        }
    } else {
        profile = JSON.parse(res)
    }

    return profile
}



export async function getConfig() {

    let config:Config|null|undefined

    // Fetch and cache 'Config', and save to locals
    const res = await redis.get(ConfigType.FREE)

    if (res==null) {
        const configValue = await prisma.config.findFirst({ where: { id: ConfigType.FREE } })
        console.log(">>>configValue",configValue)
        if(configValue){
            redis.set(ConfigType.FREE, JSON.stringify(configValue), "EX", defaultRedisExpiration)
            config = configValue
        }
    } else {
        config = JSON.parse(res)
    }

    return config
}