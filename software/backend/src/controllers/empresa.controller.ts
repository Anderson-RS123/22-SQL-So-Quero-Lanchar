import { Request, Response } from 'express';
import EmpresaService from '../services/empresa.service';
import jwt from 'jsonwebtoken'; // Para gerar o token JWT

// Assumindo que JWT_SECRET será carregado do .env
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev'; // Use a variável do .env

export const registerEmpresa = async (req: Request, res: Response) => {
  try {
    const { nome, email, senha } = req.body;

    // Verificação básica de entrada
    if (!nome || !email || !senha) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios: nome, email, senha.' });
    }

    // Verifica se já existe uma empresa com o mesmo email ou nome
    const existingEmpresaByEmail = await EmpresaService.findEmpresaByEmail(email);
    if (existingEmpresaByEmail) {
      return res.status(409).json({ message: 'Email já registrado.' }); // 409 Conflict
    }
    // Opcional: verificar também pelo nome se ele precisa ser único

    const newEmpresa = await EmpresaService.createEmpresa({ nome, email, senha });

    // Gera um token JWT para a empresa recém-registrada (opcional no registro, mas útil para auto-login)
    const token = jwt.sign(
      { id: newEmpresa._id, nome: newEmpresa.nome, email: newEmpresa.email },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expira em 1 hora
    );

    res.status(201).json({
      message: 'Empresa registrada com sucesso!',
      empresa: {
        id: newEmpresa._id,
        nome: newEmpresa.nome,
        email: newEmpresa.email
      },
      token // Envia o token para que o frontend possa logar automaticamente
    });
  } catch (error: any) {
    // Trata erros de validação do Mongoose, erros de unicidade, etc.
    if (error.code === 11000) { // Erro de chave duplicada do MongoDB
      return res.status(409).json({ message: 'Nome ou email já existente.' });
    }
    console.error('Erro ao registrar empresa:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao registrar empresa.', error: error.message });
  }
};

export const loginEmpresa = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    const empresa = await EmpresaService.findEmpresaByEmail(email);
    if (!empresa) {
      return res.status(401).json({ message: 'Credenciais inválidas.' }); // 401 Unauthorized
    }

    const isMatch = await empresa.comparePassword(senha);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // Gera um token JWT para a empresa logada
    const token = jwt.sign(
      { id: empresa._id, nome: empresa.nome, email: empresa.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login bem-sucedido!',
      token,
      empresa: {
        id: empresa._id,
        nome: empresa.nome,
        email: empresa.email
      }
    });
  } catch (error: any) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao fazer login.', error: error.message });
  }
};
