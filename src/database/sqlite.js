// src/database/sqlite.js
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Caminho do arquivo do banco de dados
const DB_FILE = process.env.SQLITE_DB_FILE || path.join(__dirname, '../data/livraria.db');

// Garante que a pasta existe
fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });

// Cria conexão singleton
let db;
function getDb() {
    if (!db) {
        db = new sqlite3.Database(DB_FILE, (err) => {
            if (err) {
                console.error('Erro ao abrir o banco SQLite:', err.message);
                throw err;
            }
        });

        // Habilita FK
        db.serialize(() => {
            db.run('PRAGMA foreign_keys = ON');
        });
    }
    return db;
}

// Executa comandos DDL/DML sem retorno
function run(sql, params = []) {
    const database = getDb();
    return new Promise((resolve, reject) => {
        database.run(sql, params, function (err) {
            if (err) return reject(err);
            resolve({ id: this.lastID, changes: this.changes });
        });
    });
}

// Consulta única linha
function get(sql, params = []) {
    const database = getDb();
    return new Promise((resolve, reject) => {
        database.get(sql, params, (err, row) => {
            if (err) return reject(err);
            resolve(row || null);
        });
    });
}

// Consulta múltiplas linhas
function all(sql, params = []) {
    const database = getDb();
    return new Promise((resolve, reject) => {
        database.all(sql, params, (err, rows) => {
            if (err) return reject(err);
            resolve(rows || []);
        });
    });
}

// Inicializa schema e (opcional) seed a partir do JSON existente
async function init() {
    // Cria tabela livros
    await run(`
    CREATE TABLE IF NOT EXISTS livros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      autor TEXT NOT NULL,
      categoria TEXT NOT NULL,
      ano INTEGER NOT NULL
    )
  `);

    // Se a tabela está vazia, popular com dados do JSON (se existir)
    const countRow = await get('SELECT COUNT(*) as count FROM livros');
    if (countRow && countRow.count === 0) {
        const jsonPath = path.join(__dirname, '../data/livros.json');
        try {
            const raw = fs.readFileSync(jsonPath, 'utf-8');
            const lista = JSON.parse(raw);
            for (const item of lista) {
                await run(
                    'INSERT INTO livros (titulo, autor, categoria, ano) VALUES (?, ?, ?, ?)',
                    [item.titulo, item.autor, item.categoria, parseInt(item.ano, 10)]
                );
            }
            console.log(`SQLite: seed inicial de ${lista.length} livros realizado.`);
        } catch (e) {
            // silencioso se arquivo não existir
        }
    }
}

module.exports = { getDb, run, get, all, init };
