import type { CategoriasRepository } from '../repositories/CategoriasRepository';

export class ListarCategoriasUseCase {
  constructor(private categoriasRepository: CategoriasRepository) {}

  async execute() {
    return this.categoriasRepository.getAll();
  }
}
