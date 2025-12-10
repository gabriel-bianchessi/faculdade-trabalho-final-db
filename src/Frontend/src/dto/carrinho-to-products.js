export class CarrinhoToProductDto {
  /**
   * @typedef {Object} ItemCarrinho
   * @prop {string} ItemCarrinho.id
   * @prop {number} ItemCarrinho.quantidade
   *
   * @typedef {Object} ProdutoCarrinho
   * @prop {number} id_produto
   * @prop {number} quantidade
   *
   * @param {ItemCarrinho[]} carrinho
   * @returns {ProdutoCarrinho[]}
   */
  static parse(carrinho) {
    return carrinho.map(item => ({
      id_produto: parseInt(item.id),
      quantidade: item.quantidade
    }));
  }
}
