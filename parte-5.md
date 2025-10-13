---
marp: true
theme: default
paginate: true
size: 16:9
header: 'API Livraria com Express.js — Parte 5 (Model)'
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
    .small {
        font-size: 0.7em;
    }
    .highlight {
        background-color: #fffbcc;
        padding: 2px 4px;
        border-radius: 4px;
    }
---

# 📚 API Livraria com Express.js — Parte 5 (Camada Model)

## Evoluindo o projeto: adicionando o Model `Livro`

<ul class="small">
    <li>👨‍🏫 <b>Professor:</b> Fabricio Bizotto</li>
    <li>📘 <b>Disciplina:</b> Desenvolvimento Web I</li>
    <li>🎓 <b>Curso:</b> Ciência da Computação</li>
    <li>📅 <b>Fase:</b> 4ª fase</li>
</ul>

---

# Roteiro

- O que é a camada <span class="highlight">Model</span>
- Implementar `Livro` (validação + serialização)
- Integrar o `Model` no Controller
- Boas práticas e testes rápidos

---

# Estrutura atualizada do projeto

```
livraria_node_http/
├─ server.js
├─ .env
├─ package.json
└─ src/
   ├─ app.js
   ├─ ...
   └─ models/
      └─ livro.model.js   <-- NOVO!
```

---

# Por que um Model?

- Centraliza regras e validações da entidade `Livro`
- Evita lógica duplicada entre rotas e controller
- Facilita testes e evolução (ex.: trocar JSON por DB)
- Garante forma consistente de entrada/saída (toJSON/fromJSON)

---

# `src/models/livro.model.js`

```js
// src/models/livro.model.js
class Livro {
  constructor({ id = null, titulo, autor, categoria, ano }) {
    this.id = id !== undefined ? id : null;
    this.titulo = String(titulo).trim();
    this.autor = String(autor).trim();
    this.categoria = String(categoria).trim();
    this.ano = Number.isInteger(ano) ? ano : parseInt(ano, 10);
    this._validar();
  }

  _validar() {
    const erros = [];
    if (!this.titulo || this.titulo.trim().length === 0) erros.push('Título é obrigatório');
    if (!this.autor || this.autor.trim().length === 0) erros.push('Autor é obrigatório');
    if (!this.categoria || this.categoria.trim().length === 0) erros.push('Categoria é obrigatória');
    if (!Number.isInteger(this.ano) || isNaN(this.ano)) erros.push('Ano deve ser um número válido');
    if (erros.length > 0) {
      const error = new Error('Dados inválidos');
      error.statusCode = 400;
      error.details = erros;
      throw error;
    }
  }
}
module.exports = Livro;
```

---

# `src/models/livro.model.js` (continuação...)

```js
// src/models/livro.model.js (continuação)
class Livro {

  // ...

  static fromJSON(json) {
    return new Livro({
      id: json.id ?? null,
      titulo: json.titulo,
      autor: json.autor,
      categoria: json.categoria,
      ano: json.ano,
    });
  }
  toJSON() {
    return {
      id: this.id,
      titulo: this.titulo,
      autor: this.autor,
      categoria: this.categoria,
      ano: this.ano,
    };
  }
}
module.exports = Livro;
```

---

# Integrando o Model ao Repository

Ajuste o repository atual para usar o Model:

```js
// src/repositories/livros.repository.js
const Livro = require("../models/livro.model");

class LivrosRepository extends RepositoryBase {

    async findAll() {
        const dados = await this._lerArquivo();
        const lista = JSON.parse(dados);
        return lista.map(item => Livro.fromJSON(item)); // <<< ALTERAÇÃO
    }

    // async findById(id) não precisa mudar
    
    async create(livroData) {
        const livros = await this.findAll();
        const novoId = await this.getNextId();
        const novoLivro = new Livro({ id: novoId, ...livroData }); // <<< ALTERAÇÃO
        livros.push(novoLivro);
        await this._saveToFile(livros.map(l => l.toJSON())); // <<< ALTERAÇÃO
        return novoLivro;
    }
    
}
module.exports = LivrosRepository;
```

# Integrando o Model ao Controller (continuação...)

```js
// src/repositories/livros.repository.js (continuação)

    async update(id, dadosAtualizados) {
        const livros = await this.findAll();
        const indice = livros.findIndex(livro => livro.id === id);

        if (indice === -1) {
            const error = new Error("Livro não encontrado");
            error.statusCode = 404;
            throw error;
        }
        livros[indice] = new Livro({ ...livros[indice], ...dadosAtualizados }); // <<< ALTERAÇÃO
        await this._saveToFile(livros.map(l => l.toJSON())); // <<< ALTERAÇÃO
        return livros[indice];
    }

    async delete(id) {
        const livros = await this.findAll();
        const indice = livros.findIndex(livro => livro.id === id);

        if (indice === -1) {
            const error = new Error("Livro não encontrado");
            error.statusCode = 404;
            throw error;
        }

        const [livroRemovido] = livros.splice(indice, 1);
        await this._saveToFile(livros.map(l => l.toJSON())); // <<< ALTERAÇÃO
        return livroRemovido;
    }
```

---

# Próximos passos

- Introduzir banco (SQLite/Postgres) e ORM (Prisma/Knex)
- Escrever testes automatizados
- Versionar API e documentar com OpenAPI/Swagger/Postman

---

# Exercícios/Desafios

- Adicionar novos campos ao Model: `editora`, e `numeroPaginas`
