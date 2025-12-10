import { AppError } from "./AppError";

export class ClienteAlreadyExistsError extends AppError {
  constructor(message: string = "Cliente já existe") {
    super(message, 409);
  }
}
