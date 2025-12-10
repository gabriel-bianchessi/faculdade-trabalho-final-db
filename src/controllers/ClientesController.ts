import type { NextFunction, Request, Response } from "express";
import { ClientesRepository } from "../application/repositories/ClientesRepository";
import { RegistrarClienteUseCase } from "../application/use_cases/RegistrarClienteUseCase";
import { LoginClienteUseCase } from "../application/use_cases/LoginClienteUseCase";

export class ClientesController {
  static async registrar(request: Request, response: Response, next: NextFunction) {
    try {
      const { nome, data_nasc, documento, email, senha } = request.body;

      if (!nome || !email || !senha) {
        return response.status(400).json({ 
          message: 'Nome, email e senha são obrigatórios' 
        });
      }

      const clientesRepository = new ClientesRepository();
      const registrarClienteUseCase = new RegistrarClienteUseCase(clientesRepository);

      const cliente = await registrarClienteUseCase.execute({
        nome,
        data_nasc: data_nasc || '2000-01-01',
        documento: documento || `DEMO${Date.now()}`,
        email,
        senha
      });

      return response.status(201).json(cliente);
    } catch (err: any) {
      console.error('Erro no registro de cliente:', err);
      return response.status(500).json({ 
        message: err.message || 'Erro ao registrar cliente' 
      });
    }
  }

  static async buscarPorEmail(request: Request, response: Response, next: NextFunction) {
    try {
      const { email } = request.params;

      if (!email) {
        return response.status(400).json({ 
          message: 'E-mail é obrigatório' 
        });
      }

      const clientesRepository = new ClientesRepository();
      const cliente = await clientesRepository.findByEmail(email);

      if (!cliente) {
        return response.status(404).json({ 
          message: 'Cliente não encontrado' 
        });
      }

      return response.status(200).json({
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
        documento: cliente.documento,
        data_nasc: cliente.data_nasc
      });
    } catch (err: any) {
      console.error('Erro ao buscar cliente:', err);
      return response.status(500).json({ 
        message: err.message || 'Erro ao buscar cliente' 
      });
    }
  }

  static async login(request: Request, response: Response, next: NextFunction) {
    try {
      const { email, senha } = request.body;

      const clientesRepository = new ClientesRepository();
      const loginClienteUseCase = new LoginClienteUseCase(clientesRepository);

      const result = await loginClienteUseCase.execute({ email, senha });

      return response.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}
