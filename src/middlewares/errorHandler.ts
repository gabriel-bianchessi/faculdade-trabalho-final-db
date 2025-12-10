import type { Request, Response, NextFunction } from "express";
import { AppError } from "../application/errors/AppError";

export function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  console.error("Erro interno do servidor:", error);

  return response.status(500).json({
    status: "error",
    message: "Erro interno do servidor",
  });
}
