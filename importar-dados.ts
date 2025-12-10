import { prisma } from './src/db/prisma/client';

interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
}

async function main() {
  console.log("🚀 Iniciando migração da Fake Store API...");

  try {
    // Buscar categorias
    const categories = await fetch(
      "https://fakestoreapi.com/products/categories"
    ).then((res) => res.json()) as string[];

    console.log(`📦 ${categories.length} categorias encontradas`);

    const categoriasMap = new Map();
    for (const category of categories) {
      let categoriaPersistida = await prisma.categoria.findFirst({
        where: { titulo: category },
      });

      if (!categoriaPersistida) {
        categoriaPersistida = await prisma.categoria.create({
          data: { titulo: category },
        });
      }
      
      categoriasMap.set(category, categoriaPersistida.id);
      console.log(`✅ Categoria: ${category}`);
    }

    const products = await fetch(
      "https://fakestoreapi.com/products"
    ).then((res) => res.json()) as FakeStoreProduct[];

    console.log(`\n📝 ${products.length} produtos encontrados`);

    for (const product of products) {
      const prod = await prisma.produto.create({
        data: {
          titulo: product.title,
          preco: product.price,
          imagem_url: product.image,
          quantidade: Math.floor(Math.random() * 100) + 10,
          categoriaDeProduto: {
            create: {
              id_categoria: categoriasMap.get(product.category),
            },
          },
        },
      });
      console.log(`✅ Produto: ${product.title}`);
    }

    console.log("\n✨ Migração concluída com sucesso!");
  } catch (error) {
    console.error("❌ Erro na migração:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();