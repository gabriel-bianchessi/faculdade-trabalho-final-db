import { PopulateError } from "../errors/PopulateError";
import { ProdutosRepository } from "../repositories/ProdutosRepository";

interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export class PopularProdutosUseCase {
  constructor(private produtosRepository: ProdutosRepository) {}

  async execute() {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      
      if (!response.ok) {
        throw new PopulateError("Erro ao buscar produtos da Fake Store API");
      }

      const products: FakeStoreProduct[] = (await response.json()) as unknown as FakeStoreProduct[];

      const results = {
        criados: 0,
        atualizados: 0,
        total: products.length
      };

      for (const product of products) {
        const produtoExistente = await this.produtosRepository.findByTitulo(product.title);

        if (produtoExistente) {
          await this.produtosRepository.incrementQuantity(produtoExistente.id, 1);
          results.atualizados++;
        } else {
          const novoProduto = await this.produtosRepository.create({
            titulo: product.title,
            preco: product.price,
            imagem_url: product.image,
            quantidade: 1,
            descricao: product.description
          });
          results.criados++;

          const categoria = await this.produtosRepository.createCategoria(product.category);
          await this.produtosRepository.linkProdutoCategoria(novoProduto.id, categoria.id);
        }
      }

      return results;
    } catch (error) {
      if (error instanceof PopulateError) {
        throw error;
      }
      throw new PopulateError("Erro ao processar produtos da Fake Store API");
    }
  }
}
