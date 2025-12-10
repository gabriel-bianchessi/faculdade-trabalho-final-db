import type { NextFunction, Request, Response } from "express";
import { CategoriasRepository } from "../application/repositories/CategoriasRepository";
import { ListarCategoriasUseCase } from '../application/use_cases/ListarCategoriasUseCase';

export class CategoriasController {
  static async listar(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const categoriasRepository = new CategoriasRepository();
      const listarProdutosUseCase = new ListarCategoriasUseCase(
        categoriasRepository,
      );

      const produtos = await listarProdutosUseCase.execute();

      return response.status(200).json(produtos);
    } catch (err) {
      next(err);
    }
  }
}
