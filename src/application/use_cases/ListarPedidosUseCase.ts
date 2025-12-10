import { PedidosRepository } from "../repositories/PedidosRepository";

export class ListarPedidosUseCase {
  constructor(private pedidosRepository: PedidosRepository) {}

  async execute(clienteId: number) {
    const pedidos = await this.pedidosRepository.findByClienteId(clienteId);

    return pedidos.map((pedido) => ({
      id: pedido.id,
      valor: pedido.valor,
      meio_pagamento: pedido.meio_pagamento,
      data: pedido.data_criacao,
      status: pedido.statusPagamentoPedidos[0]?.status || "PENDENTE",
      itens: pedido.itemPedidos.map((item) => ({
        produto: {
          id: item.produto.id,
          nome: item.produto.titulo,
          imagem: item.produto.imagem_url
        },
        preco: Number(item.valor_pago),
        quantidade: item.quantidade,
        valor_total: Number(item.valor_pago) * item.quantidade
      })),
    }));
  }
}
