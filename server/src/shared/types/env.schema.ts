import z from 'zod';

const envSchema = z.object({
    DATABASE_URL: z.url().trim(),
    PORT: z.coerce.number().int().positive().default(3001)
});

export const envServerSchema = envSchema.parse(process.env);