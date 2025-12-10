import { ClientesRepository } from "../repositories/ClientesRepository";
import { BcryptHelper } from "../../utils/bcryptHelper";
import { JwtHelper } from "../../utils/jwtHelper";
import { InvalidCredentialsError } from "../errors/InvalidCredentialsError";

interface LoginInput {
  email: string;
  senha: string;
}

export class LoginClienteUseCase {
  constructor(private clientesRepository: ClientesRepository) {}

  async execute(input: LoginInput) {
    const cliente = await this.clientesRepository.findByEmail(input.email);

    if (!cliente || !cliente.ativo) {
      throw new InvalidCredentialsError();
    }

    const senhaValida = await BcryptHelper.compare(input.senha, cliente.senha);

    if (!senhaValida) {
      throw new InvalidCredentialsError();
    }

    const token = JwtHelper.generateToken({
      clienteId: cliente.id,
      email: cliente.email
    });

    return {
      token,
      cliente: {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email
      }
    };
  }
}
