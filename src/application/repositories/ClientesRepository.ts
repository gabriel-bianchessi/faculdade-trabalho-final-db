import { prisma } from "../../db/prisma/client";

import type {Cliente} from "../../generated/prisma/client";

interface CreateClienteData {
  nome: string;
  data_nasc: Date;
  documento: string;
  email: string;
  senha: string;
}

export class ClientesRepository {
  async findByEmail(email: string): Promise<Cliente | null> {
    // SQL: SELECT * FROM Cliente WHERE email = ?
    return await prisma.cliente.findUnique({
      where: { email }
    });
  }

  async findByDocumento(documento: string): Promise<Cliente | null> {
    // SQL: SELECT * FROM Cliente WHERE documento = ?
    return await prisma.cliente.findUnique({
      where: { documento }
    });
  }

  async findById(id: number): Promise<Cliente | null> {
    // SQL: SELECT * FROM Cliente WHERE id = ?
    return await prisma.cliente.findUnique({
      where: { id }
    });
  }

  async create(data: CreateClienteData): Promise<Cliente> {
    // SQL: INSERT INTO Cliente (nome, data_nasc, documento, email, senha) VALUES (?, ?, ?, ?, ?)
    return await prisma.cliente.create({
      data
    });
  }
}
