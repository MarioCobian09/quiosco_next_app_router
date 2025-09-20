import { PrismaClient } from '@prisma/client'

// Se crea un tipo para "global" que incluya una propiedad prisma.
// Esto se hace porque en TypeScript "global" no trae por defecto esa propiedad.
const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Se exporta una instancia de Prisma.
// - Si ya existe en "globalForPrisma.prisma" (en desarrollo), se reutiliza.
// - Si no existe, se crea una nueva con logs de queries activados.
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'], // Loggea cada query que Prisma ejecuta
  })

// En desarrollo (NODE_ENV !== 'production'):
// Guardamos la instancia de Prisma en global, para no crear una nueva
// cada vez que el servidor se reinicia con Hot Reload.
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma