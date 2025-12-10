import { AppError } from "./AppError";

export class ProdutoNotFoundError extends AppError {
  constructor(message: string = "Produto não encontrado") {
    super(message, 404);
  }
}
