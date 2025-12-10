import { prisma } from "../../db/prisma/client";
import type { Pedido } from "../../generated/prisma/client";
import { MeiosPagamento, StatusPagamento, type Categoria } from "../../generated/prisma";

export class CategoriasRepository {
  async getAll(): Promise<Categoria[]> {
    // SQL: SELECT * FROM Categoria
    const result = await prisma.categoria.findMany();
    return result;
  }
}
