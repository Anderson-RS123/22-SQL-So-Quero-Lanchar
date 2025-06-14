import mongoose from 'mongoose';
import dotenv from 'dotenv'; // Importe dotenv aqui também para garantir o acesso à variável de ambiente

dotenv.config(); // Carrega as variáveis de ambiente

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.error("Erro: Variável de ambiente MONGO_URI não definida no .env");
      process.exit(1); // Encerra o processo se a URI não estiver configurada
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Erro ao conectar ao MongoDB: ${error.message}`);
    process.exit(1); // Encerra o processo em caso de falha na conexão
  }
};

export default connectDB;
