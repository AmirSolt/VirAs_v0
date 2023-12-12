import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

// npx prisma migrate dev --name init