import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();
// Puxar a URL do PostgreSQL do arquivo .env
const postgresUrl = process.env.DATABASE_URL;

export default class poolConexao{
  static _instance = null;

  constructor(){
    poolConexao._instance = new Pool({
      connectionString: postgresUrl,
      //  ssl: {
      //    rejectUnauthorized: false, // Dependendo da sua configuração de SSL, você pode precisar ajustar isso
      //  }
    });
  }

  static getInstance(){
    
    if(poolConexao._instance==null)
      new poolConexao();
    return poolConexao._instance;
  }
}