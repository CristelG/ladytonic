import type { Response, Request } from "express";
import {
  createNewsletterSubscriber,
  getAllNewsletterSubscribers,
} from "./newsletter.service.js";
import { subscriber } from "./newsletter.types.js";
import { ZodErrors } from "../../shared/errors/zod-errors.js";
import { ZodError } from "zod";

export const create = async (req: Request, res: Response) => {
  try {
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
  } catch (err) {
    if(err instanceof ZodError){
        throw ZodErrors.validation(err)
    }
    //default behaviour
    throw err;
  }
};

export const getAll = async (req: Request, res: Response) => {
  const subscribers = await getAllNewsletterSubscribers();
  res.status(200).json(subscribers);
};
