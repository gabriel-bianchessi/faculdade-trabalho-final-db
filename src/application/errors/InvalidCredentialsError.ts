import { AppError } from "./AppError";

export class InvalidCredentialsError extends AppError {
  constructor(message: string = "Credenciais inválidas") {
    super(message, 401);
  }
}
