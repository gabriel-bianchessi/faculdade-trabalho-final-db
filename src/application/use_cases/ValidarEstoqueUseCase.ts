import { ProdutosRepository } from "../repositories/ProdutosRepository";
import { ProdutoNotFoundError } from "../errors/ProdutoNotFoundError";
import { EstoqueInsuficienteError } from "../errors/EstoqueInsuficienteError";

interface ValidarEstoqueInput {
  produtoId: number;
  quantidade: number;
}

export class ValidarEstoqueUseCase {
  constructor(private produtosRepository: ProdutosRepository) {}

  async execute(input: ValidarEstoqueInput) {
    const produto = await this.produtosRepository.findById(input.produtoId);

    if (!produto) {
      throw new ProdutoNotFoundError();
    }

    const estoqueDisponivel = produto.quantidade >= input.quantidade;

    if (!estoqueDisponivel) {
      throw new EstoqueInsuficienteError(
        `Estoque insuficiente. Disponível: ${produto.quantidade}, Solicitado: ${input.quantidade}`
      );
    }

    return {
      disponivel: true,
      estoque_atual: produto.quantidade,
      quantidade_solicitada: input.quantidade
    };
  }
}
