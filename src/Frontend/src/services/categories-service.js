export class CategoriesService {
    constructor() {
        this.baseUrl = 'http://localhost:3000/api';
    }

    /**
     * @typedef {import('../../../generated/prisma/index.d.ts').Categoria} Categoria
     * @returns Promise<Categoria[]>
    */
    async getAllCategories() {
        let retorno = [];

        try {
            const response = await fetch(`${this.baseUrl}/categorias`);
            retorno = await response.json();
            return retorno;
        }
        catch (exception){
            throw exception;
        }
    }
}
