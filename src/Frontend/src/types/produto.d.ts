export interface Produto { 
    id: number;
    titulo: string;
    preco: number;
    imagem_url: string; 
    estoque_atual: number;
    descricao: string;
    categorias: string[] 
}