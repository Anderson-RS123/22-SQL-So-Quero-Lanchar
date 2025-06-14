import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IEmpresa } from '../models/empresa.model'; // Para tipagem

// Define uma interface para estender o objeto Request do Express
interface AuthRequest extends Request {
  user?: { id: string; nome: string; email: string; empresaId: string };
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev'; // Use a variável do .env

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // Verifica se o token está no cabeçalho Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // Extrai o token após "Bearer "
  }

  if (!token) {
    return res.status(401).json({ message: 'Não autorizado, token não encontrado' });
  }

  try {
    // Verifica e decodifica o token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; nome: string; email: string; empresaId: string; iat: number; exp: number };

    // Adiciona as informações do usuário decodificadas à requisição
    // O 'id' do token será o '_id' da empresa no MongoDB
    req.user = {
      id: decoded.id,
      nome: decoded.nome,
      email: decoded.email,
      empresaId: decoded.id // O ID da empresa logada é o 'id' do token
    };
    next(); // Continua para a próxima função da rota
  } catch (error) {
    console.error('Erro de validação do token:', error);
    res.status(401).json({ message: 'Não autorizado, token inválido' });
  }
};
