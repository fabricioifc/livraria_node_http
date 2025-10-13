---
marp: true
theme: default
paginate: true
size: 16:9
header: 'API Livraria com Express.js — Parte 4'
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

# 📚 API Livraria com Express.js — Parte 4 (Camada Repository)

## Evoluindo o projeto: separando persistência da lógica de negócio

<ul class="small bottom">
    <li>👨‍🏫 <b>Professor:</b> Fabricio Bizotto</li>
    <li>📘 <b>Disciplina:</b> Desenvolvimento Web I</li>
    <li>🎓 <b>Curso:</b> Ciência da Computação</li>
    <li>📅 <b>Fase:</b> 4ª fase</li>
</ul>

---

# Roteiro

- Introdução à camada **Repository**
- Criar `RepositoryBase` (interface genérica)
- Criar `LivrosRepository` (implementação JSON)
- Refatorar `LivrosController` para usar o repositório
- Testar as rotas e entender a nova arquitetura

---

# Estrutura atualizada do projeto

```
livraria_node_http/
├─ server.js
├─ .env
├─ package.json
└─ src/
├─ app.js
|- config/
│  └─ express.js
├─ data/
│  └─ livros.json
├─ repositories/
│  ├─ repository.interface.js
│  └─ livros.repository.js
├─ controllers/
│  └─ livros.controller.js
├─ routes/
│  └─ index.js
│  └─ livros.routes.js
└─ middlewares/
    └─ errorHandler.js
    └─ validar/
         └─ livros.validar.js

```

---

<!-- class: title -->
# Arquitetura: com camada Repository

![MVC](mvc.png)

A lógica de **acesso a dados** é isolada em uma camada independente.  
O **Controller** agora apenas **coordena** a requisição e chama o **Repository**.

---

<!-- class: "" -->

# `src/repositories/repository.interface.js`

```js
class RepositoryBase {

    constructor() {
        if (this.constructor === RepositoryBase) {
            throw new Error("Não é possível instanciar uma classe abstrata");
        }
        this.caminhoArquivo = null;
    }

    async findAll() { throw new Error("Método deve ser implementado"); }
    async findById(id) { throw new Error("Método deve ser implementado"); }
    async create(data) { throw new Error("Método deve ser implementado"); }
    async update(id, data) { throw new Error("Método deve ser implementado"); }
    async delete(id) { throw new Error("Método deve ser implementado"); }

    async getNextId() {
        const items = await this.findAll();
        if (items.length === 0) return 1;
        return Math.max(...items.map(item => item.id)) + 1;
    }
}

module.exports = RepositoryBase;
```

---

# `src/repositories/livros.repository.js`

```js
const fs = require("fs");
const path = require("path");
const RepositoryBase = require("./repository.interface");

class LivrosRepository extends RepositoryBase {
    constructor() {
        super();
        this.caminhoArquivo = path.join(__dirname, "../data/livros.json");
    }

    async findAll() {
        const dados = await this._lerArquivo();
        return JSON.parse(dados);
    }

    async findById(id) {
        const livros = await this.findAll();
        return livros.find(l => l.id === id);
    }

    async create(livroData) {
        const livros = await this.findAll();
        const novoId = await this.getNextId();
        const novoLivro = { id: novoId, ...livroData };
        livros.push(novoLivro);
        await this._saveToFile(livros);
        return novoLivro;
    }
```

---

# `src/repositories/livros.repository.js` (continuação)

```js
    async update(id, dadosAtualizados) {
        const livros = await this.findAll();
        const indice = livros.findIndex(l => l.id === id);
        if (indice === -1) throw new Error("Livro não encontrado");

        livros[indice] = { ...livros[indice], ...dadosAtualizados };
        await this._saveToFile(livros);
        return livros[indice];
    }

    async delete(id) {
        const livros = await this.findAll();
        const indice = livros.findIndex(l => l.id === id);
        if (indice === -1) throw new Error("Livro não encontrado");

        const livroRemovido = livros[indice];
        livros.splice(indice, 1);
        await this._saveToFile(livros);
        return livroRemovido;
    }

    async _saveToFile(data) {
        fs.writeFileSync(this.caminhoArquivo, JSON.stringify(data, null, 2), "utf8");
    }

    async _lerArquivo() {
        return await fs.promises.readFile(this.caminhoArquivo, "utf8");
    }
}

module.exports = LivrosRepository;
```

---

# Refatorando o Controller

<p class="small">
Agora o <span class="highlight">LivrosController</span><b>não manipula mais diretamente o JSON</b>,
mas usa o <b>repositório especializado</b> para isso.
</p>

![MVC com Repository](mvc.png)

> Na camada Model, o `Repository` atua como um intermediário entre o Controller e a fonte de dados (JSON).

---

# `src/controllers/livros.controller.js`

```js
const LivrosRepository = require("../repositories/livros.repository");

class LivrosController {
    constructor() {
        this.repository = new LivrosRepository();
    }

    async listarLivros(req, res, next) {
        const livros = await this.repository.findAll();
        res.status(200).json(livros);
    }

    async buscarLivroPorId(req, res, next) {
        const id = parseInt(req.params.id);
        const livro = await this.repository.findById(id);
        if (!livro) {
            return res.status(404).json({ erro: "Livro não encontrado" });
        }
        res.status(200).json(livro);
    }
```

---

# `src/controllers/livros.controller.js` (continuação)

```js
    async criarLivro(req, res, next) {
        const { titulo, autor, categoria, ano } = req.body;
        const novoLivro = await this.repository.create({
            titulo,
            autor,
            categoria,
            ano: parseInt(ano)
        });
        res.status(201).json({
            mensagem: "Livro criado com sucesso",
            data: novoLivro
        });
    }

    async atualizarLivro(req, res, next) {
        const id = parseInt(req.params.id);
        const dados = req.body;
        const livroAtualizado = await this.repository.update(id, dados);
        res.status(200).json({
            mensagem: "Livro atualizado com sucesso",
            data: livroAtualizado
        });
    }
    // ...
```

---

# `src/controllers/livros.controller.js` (continuação)

```js
// ...
    async removerLivro(req, res, next) {
        const id = parseInt(req.params.id);
        const livroRemovido = await this.repository.delete(id);
        res.status(200).json({
            mensagem: "Livro removido com sucesso",
            data: livroRemovido
        });
    }
}

module.exports = LivrosController;
```

---

# Rotas permanecem iguais

```js
const express = require("express");
const router = express.Router();
const LivrosController = require("../controllers/livros.controller");
const livrosController = new LivrosController();
const { validarLivro, validarParamId } = require("../middlewares/validar/livros.validar");

router.get("/", (req, res, next) => livrosController.listarLivros(req, res, next));
router.get("/:id", validarParamId, (req, res, next) => livrosController.buscarLivroPorId(req, res, next));
router.post("/", validarLivro, (req, res, next) => livrosController.criarLivro(req, res, next));
router.put("/:id", validarParamId, validarLivro, (req, res, next) => livrosController.atualizarLivro(req, res, next));
router.delete("/:id", validarParamId, (req, res, next) => livrosController.removerLivro(req, res, next));

module.exports = router;
```
---

# Desafios

- Instalar a extensão da ferramenta Postman no VSCode.
- Testar todas as rotas da API usando o Postman.