import type { NextFunction, Request, Response } from "express";
import { ProdutosRepository } from "../application/repositories/ProdutosRepository";
import { DetalharProdutoUseCase } from "../application/use_cases/DetalharProdutoUseCase";
import { ListarProdutosUseCase } from "../application/use_cases/ListarProdutosUseCase";
import { PopularProdutosUseCase } from "../application/use_cases/PopularProdutosUseCase";
import { ValidarEstoqueUseCase } from "../application/use_cases/ValidarEstoqueUseCase";

export class ProdutosController {
  static async listar(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { categoria, titulo } = request.query;

      const produtosRepository = new ProdutosRepository();
      const listarProdutosUseCase = new ListarProdutosUseCase(
        produtosRepository,
      );

      const produtos = await listarProdutosUseCase.execute({
        categoria: categoria as string,
        titulo: titulo as string,
      });

      return response.status(200).json(produtos);
    } catch (err) {
      next(err);
    }
  }

  static async popularProdutos(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const produtosRepository = new ProdutosRepository();
      const popularProdutosUseCase = new PopularProdutosUseCase(
        produtosRepository,
      );

      const resultado = await popularProdutosUseCase.execute();

      return response.status(200).json({
        message: "Produtos populados com sucesso",
        resultado,
      });
    } catch (err) {
      next(err);
    }
  }

  static async detalharProduto(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = request.params;
      const produtosRepository = new ProdutosRepository();
      const detalharProdutoUseCase = new DetalharProdutoUseCase(
        produtosRepository,
      );

      const produto = await detalharProdutoUseCase.execute(Number(id));

      return response.status(200).json(produto);
    } catch (err) {
      next(err);
    }
  }

  static async validarEstoque(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = request.params;
      const { quantidade } = request.body;

      const produtosRepository = new ProdutosRepository();
      const validarEstoqueUseCase = new ValidarEstoqueUseCase(
        produtosRepository,
      );

      const resultado = await validarEstoqueUseCase.execute({
        produtoId: Number(id),
        quantidade: Number(quantidade),
      });

      return response.status(200).json(resultado);
    } catch (err) {
      next(err);
    }
  }
}
