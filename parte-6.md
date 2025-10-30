---
marp: true
theme: default
paginate: true
size: 16:9
header: 'API Livraria com Express.js — Parte 6 (SQLite)'
footer: 'Desenvolvimento Web I - Ciência da Computação - 4ª fase'
style: |
    body {
        font-family: 'Arial', sans-serif;
        background-color: #ffffff;
        color: #333333;
        font-size: 0.9em;
    }
    section {
        align-content: flex-start;
        align-items: flex-start;
    }
    h1, h2, h3 {
        font-family: 'Helvetica Neue', sans-serif;
    }
    section h1 {
        font-size: 1.2em;
        margin-bottom: 0.2em;
    }
    ul li, ol li {
        font-size: 0.9em;
    }
    code {
        background-color: #f4f4f4;
        padding: 2px 4px;
        border-radius: 4px;
        font-size: 0.7em;
    }
    pre code {
        display: block;
        padding: 10px;
        overflow-x: auto;
        font-size: 0.7em;
    }
    ul.small {
        font-size: 0.7em;
        list-style-type: none;
        padding: 0;
    }
    ul.bottom {
        position: absolute;
        bottom: 60px;
        width: 90%;
    }
    .small {
        font-size: 0.7em;
    }
    .highlight {
        background-color: #fffbcc;
        padding: 2px 4px;
        border-radius: 4px;
    }
    section.title {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 2em;
    }
    section.title h1 {
        font-family: 'Helvetica Neue', sans-serif;
        font-size: 2em;
        margin-bottom: 1em;
    }
    section.title img {
        max-width: 95%;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        margin-bottom: 1em;
    }
    section.title p {
        font-size: 0.7em;
        color: #555555;
        line-height: 1.1em;
    }
    blockquote {
        padding-left: 10px;
        color: #666666;
        font-size: 0.8em;
    }
---

# 📚 API Livraria com Express.js — Parte 6 (SQLite: sqlite3 e better-sqlite3)

## Migrando de arquivo JSON para banco SQLite

<ul class="bottom small">
    <li>👨‍🏫 <b>Professor:</b> Fabricio Bizotto</li>
    <li>📘 <b>Disciplina:</b> Desenvolvimento Web I</li>
    <li>🎓 <b>Curso:</b> Ciência da Computação</li>
    <li>📅 <b>Fase:</b> 4ª fase</li>
 </ul>

---

# Roteiro

- Por que SQLite e <span class="highlight">better-sqlite3</span>
- Instalação das dependências
- Variáveis de ambiente (.env)
- Módulo de banco centralizado (`src/database/sqlite.js`)
- Inicialização no `app`
- CRUD no Repositório (SQL)
- Seed opcional a partir do JSON
- Como rodar e testar
- Erros comuns e dicas

---

# Por que SQLite + better-sqlite3?

- Substitui JSON local por um banco leve e confiável
- Não requer servidor externo (arquivo `.db`)
- `better-sqlite3` é simples e performático (API síncrona)
- Centralizamos acesso ao banco e facilitamos evolução futura

> Também instalamos `sqlite3` para referência/compatibilidade, mas a aplicação usa `better-sqlite3` no runtime.

---

# Dependências e instalação

```bash
npm i better-sqlite3 sqlite3
```

Observações:
- O `better-sqlite3` geralmente oferece binários pré‑compilados.
- Em alguns ambientes, pode compilar nativamente (precisa de `python`, `gcc`, `make`).

---

# Variáveis de ambiente (opcional)

Arquivo `.env` (raiz):

```
SQLITE_DB_FILE=/caminho/absoluto/livraria.db
PORT=3000
NODE_ENV=development
```

Se não definir `SQLITE_DB_FILE`, usamos o padrão: `src/data/livraria.db`.

---

# Estrutura atualizada do projeto

```
livraria_node_http/
├─ server.js
├─ package.json
└─ src/
   ├─ app.js
   ├─ database/
   │  └─ sqlite.js    <-- NOVO MÓDULO DE DB
   ├─ repositories/
   │  └─ livros.repository.js (CRUD SQL)
   ├─ models/
   │  └─ livro.model.js
   ├─ routes/
   └─ data/
      └─ livraria.db  (gerado)
```

---

# `src/database/sqlite.js`

```js
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DB_FILE = process.env.SQLITE_DB_FILE || path.join(__dirname, '../data/livraria.db');
fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });

let db; // singleton
function getDb() {
  if (!db) {
    db = new Database(DB_FILE);
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function run(sql, params = []) { return getDb().prepare(sql).run(...params); }
function get(sql, params = []) { return getDb().prepare(sql).get(...params); }
function all(sql, params = []) { return getDb().prepare(sql).all(...params); }

function init() {
  run(`CREATE TABLE IF NOT EXISTS livros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    autor TEXT NOT NULL,
    categoria TEXT NOT NULL,
    ano INTEGER NOT NULL
  )`);
  console.log('Banco de dados SQLite inicializado');
}
module.exports = { getDb, run, get, all, init };
```

---

# Inicialização do banco no app

```js
// src/app.js
const app = require("./config/express");
const db = require("./database/sqlite");
db.init(); // garante que a tabela exista antes das rotas

const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
app.use("/api", routes);
app.use(errorHandler);
```

---

# Repositório: CRUD com SQL

```js
// src/repositories/livros.repository.js
const Livro = require("../models/livro.model");
const db = require("../database/sqlite");

class LivrosRepository {
  async findAll() {
    const rows = await db.all("SELECT id, titulo, autor, categoria, ano FROM livros ORDER BY id ASC");
    return rows.map(r => Livro.fromJSON(r));
  }
  async findById(id) {
    const row = await db.get("SELECT id, titulo, autor, categoria, ano FROM livros WHERE id = ?", [id]);
    return row ? Livro.fromJSON(row) : null;
  }
  async create(data) {
    const novo = new Livro({ id: null, ...data });
    const res = await db.run(
      "INSERT INTO livros (titulo, autor, categoria, ano) VALUES (?, ?, ?, ?)",
      [novo.titulo, novo.autor, novo.categoria, novo.ano]
    );
    return this.findById(res.id);
  }
}
module.exports = LivrosRepository;
```

---



# Repositório: CRUD com SQL

```js
// src/repositories/livros.repository.js
const Livro = require("../models/livro.model");
const db = require("../database/sqlite");

class LivrosRepository {
  async update(id, dados) {
    const atual = new Livro({ id, ...dados });
    await db.run(
      "UPDATE livros SET titulo = ?, autor = ?, categoria = ?, ano = ? WHERE id = ?",
      [atual.titulo, atual.autor, atual.categoria, atual.ano, id]
    );
    return this.findById(id);
  }
  async delete(id) {
    const existente = await this.findById(id);
    if (!existente) {
      const e = new Error("Livro não encontrado");
      e.statusCode = 404; throw e;
    }
    await db.run("DELETE FROM livros WHERE id = ?", [id]);
    return existente;
  }
}
module.exports = LivrosRepository;
```

---

# GitIgnore atualizado


```
# SQLite database file
src/data/*.db
```

> O arquivo `.db` gerado não deve ser versionado.

---

# Rodando e testando

```bash
# desenvolvimento
npm run dev

# produção/local simples
npm start
```

---

# Resumo das mudanças

- Módulo `src/database/sqlite.js` (singleton + helpers + `init()`)
- Inicialização no `app` (`db.init()`)
- Repositório usando SQL (CRUD completo)