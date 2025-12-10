import type { NextFunction, Request, Response } from "express";
import { PedidosRepository } from "../application/repositories/PedidosRepository";
import { ProdutosRepository } from "../application/repositories/ProdutosRepository";
import { CriarPedidoUseCase } from "../application/use_cases/CriarPedidoUseCase";
import { ListarPedidosUseCase } from "../application/use_cases/ListarPedidosUseCase";

export class PedidosController {
  static async criar(request: Request, response: Response, next: NextFunction) {
    try {
      const { meio_pagamento, metodo_pagamento, itens, produtos, id_cliente } = request.body;

      const itensPedido = itens || produtos;

      const meioPagamento = meio_pagamento || metodo_pagamento || 'CREDITO';

      if (!id_cliente) {
        return response.status(400).json({ message: 'ID do cliente é obrigatório' });
      }

      const pedidosRepository = new PedidosRepository();
      const produtosRepository = new ProdutosRepository();
      const criarPedidoUseCase = new CriarPedidoUseCase(pedidosRepository, produtosRepository);

      const pedido = await criarPedidoUseCase.execute({
        id_cliente: id_cliente,
        meio_pagamento: meioPagamento,
        itens: itensPedido
      });

      return response.status(201).json(pedido);
    } catch (err) {
      next(err);
    }
  }

  static async listar(request: Request, response: Response, next: NextFunction) {
    try {
      const { id_cliente } = request.query;

      if (!id_cliente) {
        return response.status(400).json({ message: 'ID do cliente é obrigatório' });
      }

      const pedidosRepository = new PedidosRepository();
      const listarPedidosUseCase = new ListarPedidosUseCase(pedidosRepository);

      const pedidos = await listarPedidosUseCase.execute(Number(id_cliente));

      return response.status(200).json(pedidos);
    } catch (err) {
      next(err);
    }
  }

  static async listarPorCliente(request: Request, response: Response, next: NextFunction) {
    try {
      const { id_cliente } = request.params;

      if (!id_cliente) {
        return response.status(400).json({ message: 'ID do cliente é obrigatório' });
      }

      const pedidosRepository = new PedidosRepository();
      const listarPedidosUseCase = new ListarPedidosUseCase(pedidosRepository);

      const pedidos = await listarPedidosUseCase.execute(Number(id_cliente));

      return response.status(200).json(pedidos);
    } catch (err) {
      next(err);
    }
  }
}
