import { ProdutoNotFoundError } from "../errors/ProdutoNotFoundError";
import { ProdutosRepository } from "../repositories/ProdutosRepository";

export class DetalharProdutoUseCase {
  constructor(private produtosRepository: ProdutosRepository) {}

  async execute(id: number) {
    const produto = await this.produtosRepository.findById(id);

    if (!produto) {
      throw new ProdutoNotFoundError();
    }

    const categorias = produto.categoriaDeProduto.map(cp => ({
      id: cp.categoria.id,
      titulo: cp.categoria.titulo
    }));

    return {
      id: produto.id,
      titulo: produto.titulo,
      preco: produto.preco,
      imagem_url: produto.imagem_url,
      quantidade: produto.quantidade,
      data_insercao: produto.data_insercao,
      data_alteracao: produto.data_alteracao,
      categorias
    };
  }
}
