import { Request, Response } from 'express';
import EventoService from '../services/evento.service';
import { IEmpresa } from '../models/empresa.model'; // Para tipagem do req.user

// Estender a interface Request do Express para incluir o 'user' do middleware de autenticação
interface AuthRequest extends Request {
  user?: { id: string; nome: string; email: string; empresaId: string }; // 'empresaId' virá do JWT
}

export const getEventos = async (req: AuthRequest, res: Response) => {
  try {
    // O ID da empresa vem do token JWT, garantindo que o usuário só veja seus próprios dados
    const empresaId = req.user?.id; // Usamos o 'id' do usuário logado como empresaId

    if (!empresaId) {
      return res.status(401).json({ message: 'Não autorizado: ID da empresa não encontrado no token.' });
    }

    const limit = parseInt(req.query.limit as string) || 10;
    const skip = parseInt(req.query.skip as string) || 0;

    const eventos = await EventoService.getEventosByEmpresaId(empresaId, limit, skip);

    res.status(200).json(eventos);
  } catch (error: any) {
    console.error('Erro ao buscar eventos:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar eventos.', error: error.message });
  }
};

// Se você precisar de rotas para criar eventos diretamente pela API, adicione aqui (mas a IA já faz isso)
// Ex: export const createEvento = async (req: Request, res: Response) => { ... }
