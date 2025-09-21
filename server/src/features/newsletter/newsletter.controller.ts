import type { Response, Request } from "express";
import {
  createNewsletterSubscriber,
  getAllNewsletterSubscribers,
} from "./newsletter.service.js";
import { subscriber } from "./newsletter.types.js";

export const create = async (req: Request, res: Response) => {
  const validatedSubscriber = subscriber.parse(req.body);
  const newSubscriber = await createNewsletterSubscriber(validatedSubscriber);
  res.status(201).json({
    message: "User successfully created",
    newsletterSubscriber: {
      email: newSubscriber.email,
      name: newSubscriber.name,
      surname: newSubscriber.surname,
    },
  });
};

export const getAll = async (req: Request, res: Response) => {
  const subscribers = await getAllNewsletterSubscribers();
  res.status(200).json(subscribers);
};
