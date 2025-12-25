import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })

// const globalForPrisma = globalThis as {
//   prisma: PrismaClient | undefined;
// };


export const prisma = new PrismaClient({ 
  adapter,
  log: ['query'], 
})

export type ExtendedPrismaClient = typeof prisma;

export type PrismaTransactionClient = Omit<
  ExtendedPrismaClient,
  "$extends" | "$transaction" | "$disconnect" | "$connect" | "$on" | "$use"
>;

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
