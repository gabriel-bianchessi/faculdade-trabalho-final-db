import { prisma } from "../../db/prisma/client";
import type { Pedido } from "../../generated/prisma/client";
import { MeiosPagamento, StatusPagamento } from "../../generated/prisma";

interface CreatePedidoData {
  id_cliente: number;
  valor: number;
  meio_pagamento: MeiosPagamento;
  itens: {
    id_produto: number;
    quantidade: number;
    valor_pago: number;
  }[];
}

export class PedidosRepository {
  async create(data: CreatePedidoData): Promise<Pedido> {
    return await prisma.$transaction(async (tx) => {
      for (const item of data.itens) {
        // SQL: SELECT * FROM Produto WHERE id = ?
        const produto = await tx.produto.findUnique({
          where: { id: item.id_produto }
        });

        if (!produto || produto.quantidade < item.quantidade) {
          throw new Error(
            `Estoque insuficiente para o produto ${item.id_produto}`
          );
        }
      }

      // SQL: INSERT INTO Pedido (id_cliente, valor, meio_pagamento, data_criacao)
      //      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      const pedido = await tx.pedido.create({
        data: {
          id_cliente: data.id_cliente,
          valor: data.valor,
          meio_pagamento: data.meio_pagamento
        }
      });

      for (const item of data.itens) {
        // SQL: INSERT INTO ItemPedido (id_pedido, id_produto, quantidade, valor_pago)
        //      VALUES (?, ?, ?, ?)
        await tx.itemPedido.create({
          data: {
            id_pedido: pedido.id,
            id_produto: item.id_produto,
            quantidade: item.quantidade,
            valor_pago: item.valor_pago
          }
        });

        // SQL: UPDATE Produto SET quantidade = quantidade - ? WHERE id = ?
        await tx.produto.update({
          where: { id: item.id_produto },
          data: {
            quantidade: {
              decrement: item.quantidade
            }
          }
        });
      }

      // SQL: INSERT INTO StatusPagamentoPedido (id_pedido, status, data)
      //      VALUES (?, 'PENDENTE', CURRENT_TIMESTAMP)
      await tx.statusPagamentoPedido.create({
        data: {
          id_pedido: pedido.id,
          status: StatusPagamento.PENDENTE
        }
      });

      return pedido;
    });
  }

  async findByClienteId(clienteId: number) {
    // SQL: SELECT p.*, ip.*, prod.*, spp.*
    //      FROM Pedido p
    //      LEFT JOIN ItemPedido ip ON p.id = ip.id_pedido
    //      LEFT JOIN Produto prod ON ip.id_produto = prod.id
    //      LEFT JOIN StatusPagamentoPedido spp ON p.id = spp.id_pedido
    //      WHERE p.id_cliente = ?
    //      ORDER BY p.data_criacao DESC
    return await prisma.pedido.findMany({
      where: { id_cliente: clienteId },
      include: {
        itemPedidos: {
          include: {
            produto: true
          }
        },
        statusPagamentoPedidos: {
          orderBy: {
            data: "desc"
          },
          take: 1
        }
      },
      orderBy: {
        data_criacao: "desc"
      }
    });
  }
}
