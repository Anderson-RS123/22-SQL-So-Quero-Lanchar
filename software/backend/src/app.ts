import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; // Importe dotenv

dotenv.config(); // Carregue as variáveis de ambiente no início

// Importe as rotas da empresa
import empresaRoutes from './routes/empresa.route';

const app = express();

app.use(cors()); // Habilita CORS para permitir requisições de outras origens (seu frontend React)
app.use(express.json()); // Habilita o Express para parsear corpos de requisição JSON

// Defina as rotas
app.use('/api/empresas', empresaRoutes); // Todas as rotas de empresa começarão com /api/empresas

// Rota de teste básica
app.get('/', (req, res) => {
  res.send('API de Monitoramento de Caminhões - Rodando!');
});

export default app;
