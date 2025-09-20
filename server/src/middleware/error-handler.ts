import type { NextFunction, Request, Response } from "express";


const middleware = (
  err: Error & { status?: number },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const code = (err as any).status || 500;
  logErrors(err);
  res.status(code).send({ message: "Something went wrong with the server" });
};

const logErrors = (e: Error) => {
  console.error(e.stack);
};


export default middleware;
