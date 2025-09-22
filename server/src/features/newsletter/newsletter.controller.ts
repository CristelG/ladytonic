import type { Response, Request } from "express";
import {
  createNewsletterSubscriber,
  getAllNewsletterSubscribers,
} from "./newsletter.service.js";
import { subscriber, type NewsletterSubscriber } from "./newsletter.types.js";
import { ZodErrors } from "../../shared/errors/zod-errors.js";
import { ZodError } from "zod";
import { escapeHtml } from "../../shared/utils/utils.js";

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
    const sanitized = sanitizeSubscriber(validatedSubscriber)
    const newSubscriber = await createNewsletterSubscriber(sanitized);
    res.status(201).json({
      message: "User successfully created",
      newsletterSubscriber: {
        email: newSubscriber.email,
        name: newSubscriber.name,
        surname: newSubscriber.surname,
      },
    });
  } catch (err) {
    if (err instanceof ZodError) {
      throw ZodErrors.validation(err);
    }
    //default behaviour
    throw err;
  }
};

export const getAll = async (req: Request, res: Response) => {
  const subscribers = await getAllNewsletterSubscribers();
  res.status(200).json(subscribers);
};
