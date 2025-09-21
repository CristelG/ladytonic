import prisma from "../../shared/prisma/index.js";
import type { NewsletterSubscriber } from "./newsletter.types.js";

export const createNewsletterSubscriber = async (
  data: NewsletterSubscriber
) => {
  const newSubscriber = await prisma.newsletter.create({
    data: {
      email: data.email,
      name: data.name,
      surname: data.surname,
    },
  });
  return newSubscriber
};

export const getAllNewsletterSubscribers = async () => {
  return await prisma.newsletter.findMany();
};
