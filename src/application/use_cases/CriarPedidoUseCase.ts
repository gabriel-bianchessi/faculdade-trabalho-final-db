import { PedidosRepository } from "../repositories/PedidosRepository";
import { ProdutosRepository } from "../repositories/ProdutosRepository";
import { EstoqueInsuficienteError } from "../errors/EstoqueInsuficienteError";
import { ProdutoNotFoundError } from "../errors/ProdutoNotFoundError";
import { MeiosPagamento } from "../../generated/prisma/";

interface ItemPedido {
  id_produto: number;
  quantidade: number;
}

interface CriarPedidoInput {
  id_cliente: number;
  meio_pagamento: MeiosPagamento;
  itens: ItemPedido[];
}

export class CriarPedidoUseCase {
  constructor(
    private pedidosRepository: PedidosRepository,
    private produtosRepository: ProdutosRepository
  ) {}

  async execute(input: CriarPedidoInput) {
    let valorTotal = 0;
    const itensComPreco = [];

    for (const item of input.itens) {
      const produto = await this.produtosRepository.findById(item.id_produto);

      if (!produto) {
        throw new ProdutoNotFoundError(`Produto ${item.id_produto} não encontrado`);
      }

      if (produto.quantidade < item.quantidade) {
        throw new EstoqueInsuficienteError(
          `Estoque insuficiente para ${produto.titulo}. Disponível: ${produto.quantidade}`
        );
      }

      const valorItem = Number(produto.preco) * item.quantidade;
      valorTotal += valorItem;

      itensComPreco.push({
        id_produto: item.id_produto,
        quantidade: item.quantidade,
        valor_pago: Number(produto.preco)
      });
    }

    const pedido = await this.pedidosRepository.create({
      id_cliente: input.id_cliente,
      valor: valorTotal,
      meio_pagamento: input.meio_pagamento,
      itens: itensComPreco
    });

    return {
      id: pedido.id,
      valor: pedido.valor,
      meio_pagamento: pedido.meio_pagamento,
      data_criacao: pedido.data_criacao
    };
  }
}
