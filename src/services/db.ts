import { prisma } from "../clients/prisma";
import { ConfigType, Message, MessageDir, MessageRole, Config, Profile } from "@prisma/client";
import { redis } from "../clients/redis";
import { Express } from "express";


export async function getProfile(fbMessengerId: string) {

    let profile:(Profile & {messages: Message[];} & {_count:{messages:number}}) | null | undefined

    await redis.get(ConfigType.FREE, async (err, res) => {
        if (err||res==null) {
            const profileValue = await prisma.profile.findFirst({
                where: {
                    fb_messenger_id: fbMessengerId
                },
                include: {
                    messages: {
                        take: -10,
                        orderBy: {
                            created_at: 'desc',
                        },
                    },
                    _count: {
                        select: { messages: true },
                    },
                }
            })
            redis.set(ConfigType.FREE, JSON.stringify(profileValue))
            profile = profileValue
        } else {
            profile = JSON.parse(res)
        }
    })
    
    return profile
}



export async function getConfig() {

    let config:Config|null|undefined

    // Fetch and cache 'Config', and save to locals
    await redis.get(ConfigType.FREE, async (err, res) => {
        if (err||res==null) {
            const configValue = await prisma.config.findFirst({ where: { id: ConfigType.FREE } })
            redis.set(ConfigType.FREE, JSON.stringify(config))
            config = configValue
        } else {
            config = JSON.parse(res)
        }
    })

    return config
}