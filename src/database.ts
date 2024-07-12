import { Database as driver } from "sqlite3";
import { open } from "sqlite";

const filename = "database.sqlite";
const databaseConnectionPromise = open({ driver, filename });

// Função assíncrona auto-invocada para configurar a conexão e as tabelas
void (async function () {
  const connection = await databaseConnectionPromise;

  // Criação da tabela 'users' se não existir
  await connection.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

  // Criação da tabela 'posts' se não existir
  await connection.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      userId INTEGER NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  // Inserção de um usuário padrão 'admin' se não existir
  try {
    await connection.exec(`
    INSERT INTO users (username, password) VALUES ('admin', 'admin')
  `);
  } catch (error) {
    console.log("User admin already exists"); // Mensagem caso o usuário 'admin' já exista
  }
})();

export default databaseConnectionPromise;
