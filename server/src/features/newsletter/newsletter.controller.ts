import type { Response, Request } from "express";
import {
  createNewsletterSubscriber,
  getAllNewsletterSubscribers,
} from "./newsletter.service";
import { subscriber, type NewsletterSubscriber } from "./newsletter.types";
import { ZodErrors } from "../../shared/errors/zod-errors";
import { ZodError } from "zod";
import { escapeHtml } from "../../shared/utils/utils";
import { PrismaErrors } from "../../shared/errors/prisma-errors";

const sanitizeSubscriber = (validatedEntity: NewsletterSubscriber) => {
  return {
    email: escapeHtml(validatedEntity.email.trim().toLowerCase()),
    name: escapeHtml(validatedEntity.name.trim()),
    surname: escapeHtml(validatedEntity.surname.trim()),
  };
};

export const create = async (req: Request, res: Response) => {
  try {
    const validatedSubscriber = subscriber.parse(req.body);
    const sanitized = sanitizeSubscriber(validatedSubscriber);
    const newSubscriber = await createNewsletterSubscriber(sanitized);
    res.status(201).json({
      message: "User successfully created",
      newsletterSubscriber: {
        email: newSubscriber.email,
        name: newSubscriber.name,
        surname: newSubscriber.surname,
      },
    });
  } catch (err: any) {
    if (err instanceof ZodError) {
      throw ZodErrors.validation(err);
    }
    //default behaviour
    throw err;
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const subscribers = await getAllNewsletterSubscribers();
    res.status(200).json(subscribers);
  } catch (err: any) {
    throw err;
  }
};
