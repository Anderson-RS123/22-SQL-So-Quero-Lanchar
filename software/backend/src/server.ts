import app from './app'; // Importe a aplicação Express
import connectDB from './config/database'; // Importe a função de conexão com o DB
import dotenv from 'dotenv'; // Importe dotenv aqui também para garantir o acesso

dotenv.config(); // Carrega as variáveis de ambiente

// Conectar ao banco de dados
connectDB();

const PORT = process.env.PORT || 3000; // Usa a porta do .env ou 3000 como fallback

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
