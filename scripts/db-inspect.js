const sqlite3 = require('sqlite3');
const path = require('path');

const DB_FILE = process.env.SQLITE_DB_FILE || path.join(__dirname, '../src/data/livraria.db');

const db = new sqlite3.Database(DB_FILE, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Erro ao abrir DB:', err.message);
    process.exit(1);
  }
});

db.serialize(() => {
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
    if (err) return console.error('Erro listando tabelas:', err.message);
    console.log('Tabelas no DB:', rows.map(r => r.name));

    db.get('SELECT count(*) as cnt FROM livros', (err2, r2) => {
      if (err2) {
        console.log('Tabela livros não existe ou erro ao contar:', err2.message);
      } else {
        console.log('Registros na tabela livros:', r2.cnt);
      }
      db.close();
    });
  });
});
