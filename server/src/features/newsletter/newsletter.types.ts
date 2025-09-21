import { z } from "zod";

export const subscriber = z.object({
  email: z.email(),
  name: z.string().min(1),
  surname: z.string().min(1),
});

export type NewsletterSubscriber = z.infer<typeof subscriber>;
