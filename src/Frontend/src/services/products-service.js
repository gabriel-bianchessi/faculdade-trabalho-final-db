export class ProductsService {
    constructor() {
        this.baseUrl = 'http://localhost:3000/api';
    }

    /**
     * @typedef {import('../../../generated/prisma/index.d.ts').Produto} Produto
     * @type Promise<Produto[]>
    */
    async getAllProducts() {
        try {
            const response = await fetch(`${this.baseUrl}/produtos`);

            if (!response.ok) {
                throw new Error('Erro ao carregar produtos');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            throw error;
        }
    }


    getProductsByCategory(category) {
        const retorno = fetch(`${this.baseUrl}/products/category/${category}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar produtos da categoria');
                }
                return response.json();
            })
            .catch(error => {
                console.error('Erro ao buscar produtos por categoria:', error);
                throw error;
            });
        return retorno;
    }
}
