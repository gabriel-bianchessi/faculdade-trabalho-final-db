import { AppError } from "./AppError";

export class PopulateError extends AppError {
  constructor (message: string = "Erro ao popular banco com Fake Store API") {
    super(message, 400)
  }
}