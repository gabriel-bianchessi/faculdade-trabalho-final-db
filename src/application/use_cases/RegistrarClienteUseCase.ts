import { BcryptHelper } from "../../utils/bcryptHelper";
import { ClienteAlreadyExistsError } from "../errors/ClienteAlreadyExistsError";
import { ClientesRepository } from "../repositories/ClientesRepository";

interface RegistrarClienteInput {
  nome: string;
  data_nasc: string;
  documento: string;
  email: string;
  senha: string;
}

export class RegistrarClienteUseCase {
  constructor(private clientesRepository: ClientesRepository) {}

  async execute(input: RegistrarClienteInput) {
    console.log('Tentando registrar cliente:', { email: input.email, nome: input.nome });

    const clienteExistenteEmail = await this.clientesRepository.findByEmail(input.email);

    if (clienteExistenteEmail) {
      console.log('Cliente já existe, retornando dados existentes');
      return {
        id: clienteExistenteEmail.id,
        nome: clienteExistenteEmail.nome,
        email: clienteExistenteEmail.email,
        documento: clienteExistenteEmail.documento,
        data_nasc: clienteExistenteEmail.data_nasc
      };
    }

    try {
      console.log('Criando novo cliente');
      const senhaHash = await BcryptHelper.hash(input.senha);

      const cliente = await this.clientesRepository.create({
        nome: input.nome,
        data_nasc: new Date(input.data_nasc),
        documento: input.documento,
        email: input.email,
        senha: senhaHash
      });

      console.log('Cliente criado com sucesso:', cliente.id);
      
      return {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
        documento: cliente.documento,
        data_nasc: cliente.data_nasc
      };
    } catch (error: any) {
      console.error('Erro ao criar cliente:', error);
      if (error.code === 'P2002' || error.message?.includes('Unique constraint')) {
        console.log('Erro de duplicação detectado, buscando cliente existente');
        const clienteExistente = await this.clientesRepository.findByEmail(input.email);
        if (clienteExistente) {
          return {
            id: clienteExistente.id,
            nome: clienteExistente.nome,
            email: clienteExistente.email,
            documento: clienteExistente.documento,
            data_nasc: clienteExistente.data_nasc
          };
        }
      }
      throw error;
    }
  }
}
