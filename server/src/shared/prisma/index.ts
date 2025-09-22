import { PrismaClient } from "../../../generated/prisma/index";
import { envServerSchema } from "../types/env.schema";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: envServerSchema.DATABASE_URL,
    },
  },
});

export default prisma;
