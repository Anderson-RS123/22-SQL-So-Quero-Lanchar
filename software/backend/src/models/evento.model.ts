import mongoose, { Document, Schema, Types } from 'mongoose';

// Interface para o documento Evento
export interface IEvento extends Document {
  _id: Types.ObjectId;
  empresaId: string; // Ou Types.ObjectId se você for criar um ref no futuro
  caminhaoId: string;
  motoristaId: string;
  motoristaNome: string;
  timestamp: Date; // Usaremos o tipo Date para timestamps
  tipoEvento: 'utilizou_celular' | 'bocejo' | string; // Use um enum ou string
  confianca?: number; // Opcional, se sua IA começar a enviar
}

// Esquema do Mongoose para a coleção 'eventos'
const EventoSchema: Schema = new Schema({
  empresaId: { type: String, required: true }, // Referência ao ID da empresa
  caminhaoId: { type: String, required: true },
  motoristaId: { type: String, required: true },
  motoristaNome: { type: String, required: true },
  timestamp: { type: Date, default: Date.now, required: true }, // Garante que é um Date
  tipoEvento: { type: String, required: true },
  confianca: { type: Number, min: 0.0, max: 1.0 } // 0.0 a 1.0
}, {
  timestamps: true // Adiciona createdAt e updatedAt automaticamente (opcional se já tiver timestamp)
});

// Criar índices para otimizar buscas
EventoSchema.index({ empresaId: 1, timestamp: -1 }); // Busca por empresa e ordena por tempo (mais recente primeiro)
EventoSchema.index({ caminhaoId: 1, timestamp: -1 });
EventoSchema.index({ motoristaId: 1, timestamp: -1 });


export default mongoose.model<IEvento>('Evento', EventoSchema);
