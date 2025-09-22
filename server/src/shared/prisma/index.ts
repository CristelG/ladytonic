import { PrismaClient } from "../../../generated/prisma/index.js";
import { envServerSchema } from "../types/env.schema.js";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: envServerSchema.DATABASE_URL,
    },
  },
});

export default prisma;
