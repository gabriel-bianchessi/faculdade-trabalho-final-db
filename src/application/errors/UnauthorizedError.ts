import { AppError } from "./AppError";

export class UnauthorizedError extends AppError {
  constructor(message: string = "Não autorizado") {
    super(message, 401);
  }
}
