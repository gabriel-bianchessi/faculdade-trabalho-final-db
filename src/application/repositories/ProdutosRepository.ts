import { prisma } from "../../db/prisma/client";
import type { Produto } from "../../generated/prisma";

interface CreateProdutoData {
  titulo: string;
  preco: number;
  imagem_url: string;
  quantidade: number;
  descricao: string;
}

export class ProdutosRepository {
  async findAll(filters?: { categoria?: string; titulo?: string }) {
    const where: any = {};

    if (filters?.titulo) {
      where.titulo = {
        contains: filters.titulo
      };
    }

    if (filters?.categoria) {
      where.categoriaDeProduto = {
        some: {
          categoria: {
            titulo: {
              contains: filters.categoria
            }
          }
        }
      };
    }

    // SQL: SELECT p.*, cp.*, c.* FROM Produto p
    //      LEFT JOIN CatedoriaDeProduto cp ON p.id = cp.id_produto
    //      LEFT JOIN Categoria c ON cp.id_categoria = c.id
    //      WHERE p.titulo LIKE ? AND c.titulo LIKE ?
    return await prisma.produto.findMany({
      where,
      include: {
        categoriaDeProduto: {
          include: {
            categoria: true
          }
        }
      }
    });
  }

  async findById(id: number) {
    // SQL: SELECT p.*, cp.*, c.* FROM Produto p
    //      LEFT JOIN CatedoriaDeProduto cp ON p.id = cp.id_produto
    //      LEFT JOIN Categoria c ON cp.id_categoria = c.id
    //      WHERE p.id = ?
    return await prisma.produto.findUnique({
      where: { id },
      include: {
        categoriaDeProduto: {
          include: {
            categoria: true
          }
        }
      }
    });
  }

  async findByTitulo(titulo: string): Promise<Produto | null> {
    // SQL: SELECT * FROM Produto WHERE titulo = ? LIMIT 1
    return await prisma.produto.findFirst({
      where: { titulo }
    });
  }

  async create(data: CreateProdutoData): Promise<Produto> {
    // SQL: INSERT INTO Produto (titulo, preco, imagem_url, quantidade, descricao)
    //      VALUES (?, ?, ?, ?, ?)
    return await prisma.produto.create({
      data: {
        titulo: data.titulo,
        preco: data.preco,
        imagem_url: data.imagem_url,
        quantidade: data.quantidade,
        descricao: data.descricao
      }
    });
  }

  async incrementQuantity(id: number, quantidade: number): Promise<Produto> {
    // SQL: UPDATE Produto SET quantidade = quantidade + ? WHERE id = ?
    return await prisma.produto.update({
      where: { id },
      data: {
        quantidade: {
          increment: quantidade
        }
      }
    });
  }

  async createCategoria(titulo: string) {
    // SQL: SELECT * FROM Categoria WHERE titulo = ? LIMIT 1
    // SQL: INSERT INTO Categoria (titulo) VALUES (?)
    return await prisma.categoria.findFirst({
      where: { titulo }
    }) ?? await prisma.categoria.create({
      data: { titulo }
    });
  }

  async linkProdutoCategoria(idProduto: number, idCategoria: number) {
    // SQL: SELECT * FROM CatedoriaDeProduto WHERE id_produto = ? AND id_categoria = ? LIMIT 1
    const exists = await prisma.catedoriaDeProduto.findFirst({
      where: {
        id_produto: idProduto,
        id_categoria: idCategoria
      }
    });

    if (!exists) {
      // SQL: INSERT INTO CatedoriaDeProduto (id_produto, id_categoria) VALUES (?, ?)
      await prisma.catedoriaDeProduto.create({
        data: {
          id_produto: idProduto,
          id_categoria: idCategoria
        }
      });
    }
  }
}
