import type { NextFunction, Request, Response } from "express";

const middleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const code = (err as any).status || 500;
  const type = err.message || "Something went wrong with the server";
  logErrors(err);
  res.status(code).json({ type, error: err });
};

const logErrors = (e: Error) => {
  console.error(e.stack);
};

export default middleware;

/* 
There will be custom classes for errors, such as DB/Validation related, to separate http & app concerns, avoiding automatic bubble up, and defaulting to it in case of unhandled errors
*/