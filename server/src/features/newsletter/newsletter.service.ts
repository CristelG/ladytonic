import { PrismaErrors } from "../../shared/errors/prisma-errors";
import prisma from "../../shared/prisma/index";
import type { NewsletterSubscriber } from "./newsletter.types";

export const createNewsletterSubscriber = async (
  data: NewsletterSubscriber
) => {
  try {
    const newSubscriber = await prisma.newsletter.create({
      data: {
        email: data.email,
        name: data.name,
        surname: data.surname,
      },
    });
    return newSubscriber;
  } catch (err: any) {
    if (err?.code) {
      throw PrismaErrors.code(err);
    }
    //default behaviour in case of no code
    throw err;
  }
};

export const getAllNewsletterSubscribers = async () => {
  try {
    return await prisma.newsletter.findMany();
  } catch (err: any) {
    if (err?.code) {
      throw PrismaErrors.code(err);
    }
  }
};
