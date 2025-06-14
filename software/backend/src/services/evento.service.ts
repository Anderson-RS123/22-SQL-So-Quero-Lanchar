import Evento, { IEvento } from '../models/evento.model';
import { Types } from 'mongoose';

class EventoService {
  /**
   * Busca eventos de monitoramento por empresaId.
   * @param empresaId O ID da empresa para filtrar os eventos.
   * @param limit Limite de eventos a retornar (opcional).
   * @param skip Número de eventos a pular (para paginação, opcional).
   * @returns Um array de documentos de evento.
   */
  async getEventosByEmpresaId(
    empresaId: string, // Recebemos como string do token JWT
    limit: number = 10,
    skip: number = 0
  ): Promise<IEvento[]> {
    // MongoDB armazena empresaId como string, então comparamos com string
    return Evento.find({ empresaId })
                 .sort({ timestamp: -1 }) // Ordena do mais recente para o mais antigo
                 .skip(skip)
                 .limit(limit)
                 .lean(); // Retorna objetos JavaScript puros, mais performático para leitura
  }

  // Você pode adicionar outros métodos, como buscar por motorista, caminhão, intervalo de datas, etc.
}

export default new EventoService();
