import Empresa, { IEmpresa } from '../models/empresa.model';

class EmpresaService {
  /**
   * Cria uma nova empresa no banco de dados.
   * @param empresaData Os dados da empresa a serem criados.
   * @returns O documento da empresa criada.
   */
  async createEmpresa(empresaData: Partial<IEmpresa>): Promise<IEmpresa> {
    const empresa = new Empresa(empresaData);
    await empresa.save();
    return empresa;
  }

  /**
   * Encontra uma empresa pelo email.
   * @param email O email da empresa a ser encontrada.
   * @returns O documento da empresa ou null se não for encontrada.
   */
  async findEmpresaByEmail(email: string): Promise<IEmpresa | null> {
    return Empresa.findOne({ email });
  }

  // Você pode adicionar outros métodos aqui, como findById, update, delete, etc.
}

export default new EmpresaService();
