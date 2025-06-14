import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Importe as rotas
import empresaRoutes from './routes/empresa.route';
import eventoRoutes from './routes/evento.route'; // Importe as rotas de evento

const app = express();

app.use(cors());
app.use(express.json());

// Defina as rotas
app.use('/api/empresas', empresaRoutes);
app.use('/api/eventos', eventoRoutes); // Adicione as rotas de evento

app.get('/', (req, res) => {
  res.send('API de Monitoramento de Caminhões - Rodando!');
});

export default app;
