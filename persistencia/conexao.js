import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();
// Puxar a URL do PostgreSQL do arquivo .env
const postgresUrl = process.env.DATABASE_URL;

export default class poolConexao {
  // Instância estática do Pool
  static _instance = null;

  constructor() {
    if (!poolConexao._instance) {
      // Inicializa a conexão com o banco apenas uma vez
      poolConexao._instance = new Pool({
        connectionString: postgresUrl,
        // ssl: {
        //   rejectUnauthorized: false, // Dependendo da sua configuração de SSL, você pode precisar ajustar isso
        // }
      });
    }
  }

  // Retorna a instância única da conexão com o banco
  static getInstance() {
    if (!poolConexao._instance) {
      new poolConexao();  // Inicializa a instância, se não existir
    }
    return poolConexao._instance;
  }
}
