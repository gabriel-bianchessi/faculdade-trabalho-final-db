/**
 * @typedef {Object} ItemCarrinho
 * @prop {string} ItemCarrinho.id
 * @prop {number} ItemCarrinho.quantidade
 */
class CarrinhoService {
  KEY_LOCAL_STORAGE = "@fake-store-carrinho"

  /** @type {ItemCarrinho[] | null} */
  _itensCarrinho = null

  constructor() {
    this.recuperarItensLocalStorage()
  }

  /**
   * @returns {ItemCarrinho[]}
   */
  get itensCarrinho() {
    if (!this._itensCarrinho) {
      this.recuperarItensLocalStorage()
    }

    return this._itensCarrinho || []
  }

  recuperarItensLocalStorage() {
    try {
      const items = localStorage.getItem(this.KEY_LOCAL_STORAGE)

      /** @type {ItemCarrinho[]} */
      const parsedItems = JSON.parse(items)

      if (parsedItems === null || parsedItems === undefined) {
        this._itensCarrinho = []
      } else {
        this._itensCarrinho = parsedItems
      }
    } catch (err) {
      this._itensCarrinho = []
    }
  }

  /**
   * @param {ItemCarrinho} item 
   */
  adicionarItem({
    id,
    quantidade = 1
  }) {
    if (!this._itensCarrinho) {
      this.recuperarItensLocalStorage()
    }

    let carrinho = this._itensCarrinho

    if (carrinho.length === 0) {
      carrinho = [{ id, quantidade }]
    } else {
      const indexItemJaExistente = carrinho.findIndex(item => item.id === id)
      
      if (indexItemJaExistente >= 0) {
        carrinho[indexItemJaExistente].quantidade += quantidade
      } else {
        carrinho.push({id, quantidade})
      }
    }

    localStorage.setItem(this.KEY_LOCAL_STORAGE, JSON.stringify(carrinho))
    this._itensCarrinho = carrinho
  }

  /**
   * @param {string} id 
   */
  removerItem(id) {
    if (!this._itensCarrinho) {
      this.recuperarItensLocalStorage()
    }

    this._itensCarrinho = this._itensCarrinho.filter(item => item.id !== id)
    localStorage.setItem(this.KEY_LOCAL_STORAGE, JSON.stringify(this._itensCarrinho))
  }

  /**
   * @param {string} id
   * @param {number} novaQuantidade 
   */
  atualizarQuantidade(id, novaQuantidade) {
    if (!this._itensCarrinho) {
      this.recuperarItensLocalStorage()
    }

    const item = this._itensCarrinho.find(item => item.id === id)
    if (item) {
      item.quantidade = novaQuantidade
      localStorage.setItem(this.KEY_LOCAL_STORAGE, JSON.stringify(this._itensCarrinho))
    }
  }

  limparCarrinho() {
    this._itensCarrinho = []
    localStorage.setItem(this.KEY_LOCAL_STORAGE, JSON.stringify([]))
  }

  obterQuantidadePorItem(id) {
    if (!this._itensCarrinho) {
      this.recuperarItensLocalStorage()
    }

    const quantidade = this._itensCarrinho.find(item => item.id === `${id}`)?.quantidade;
    console.log(quantidade);

    return quantidade || 0
  }

  get totalItens() {
    return this.itensCarrinho.reduce((total, item) => total + item.quantidade, 0)
  }

}

export { CarrinhoService }