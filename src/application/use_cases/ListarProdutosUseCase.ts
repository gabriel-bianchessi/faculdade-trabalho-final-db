import type { Categoria } from '../../generated/prisma';
import { ProdutosRepository } from "../repositories/ProdutosRepository";

interface ListarProdutosInput {
  categoria?: string;
  titulo?: string;
}

export class ListarProdutosUseCase {
  constructor(private produtosRepository: ProdutosRepository) {}

  async execute(filters?: ListarProdutosInput) {
    const produtos = await this.produtosRepository.findAll(filters);

    return produtos.map(produto => ({
      id: produto.id,
      titulo: produto.titulo,
      preco: produto.preco,
      imagem_url: produto.imagem_url,
      estoque_atual: produto.quantidade,
      descricao: produto.descricao,
      categorias: produto.categoriaDeProduto.map(cp => cp.categoria.titulo)
    }));
  }
}
