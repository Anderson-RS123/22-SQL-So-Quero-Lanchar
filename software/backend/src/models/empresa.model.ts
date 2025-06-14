import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs'; // Para criptografar a senha

// Define a interface para o documento Empresa no TypeScript
export interface IEmpresa extends Document {
  nome: string;
  email: string;
  senha: string;
  createdAt: Date;
  updatedAt: Date;
  // Método para comparar a senha fornecida com a senha hash no banco de dados
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define o esquema do Mongoose para a coleção 'Empresa'
const EmpresaSchema: Schema = new Schema({
  nome: { type: String, required: true, unique: true }, // Nome da empresa, único
  email: { type: String, required: true, unique: true }, // Email para login, único
  senha: { type: String, required: true }, // Senha, será criptografada
  createdAt: { type: Date, default: Date.now }, // Data de criação
  updatedAt: { type: Date, default: Date.now }  // Data da última atualização
});

// Middleware (pré-save) para criptografar a senha antes de salvar no DB
EmpresaSchema.pre<IEmpresa>('save', async function(next) {
  // Só criptografa a senha se ela foi modificada ou é nova
  if (!this.isModified('senha')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10); // Gera um salt para a criptografia
    this.senha = await bcrypt.hash(this.senha, salt); // Criptografa a senha
    next();
  } catch (error: any) {
    next(error); // Passa o erro para o próximo middleware ou para o catch
  }
});

// Adiciona um método ao esquema para comparar senhas
EmpresaSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.senha);
};

// Exporta o modelo Mongoose, que interage com a coleção 'Empresa' no MongoDB
export default mongoose.model<IEmpresa>('Empresa', EmpresaSchema);
