import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();


// Puxar a URL do PostgreSQL do arquivo .env

const postgresUrl = process.env.DATABASE_URL;

// Criar uma pool de clientes PostgreSQL
const poolConexao = new Pool({
  connectionString: postgresUrl,
  //  ssl: {
  //    rejectUnauthorized: false, // Dependendo da sua configuração de SSL, você pode precisar ajustar isso
  //  }
});

export default poolConexao;
