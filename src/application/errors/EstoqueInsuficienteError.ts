import { AppError } from "./AppError";

export class EstoqueInsuficienteError extends AppError {
  constructor(message: string = "Estoque insuficiente") {
    super(message, 400);
  }
}
