const fs = require("fs");
const path = require("path");
const livrosPath = path.join(__dirname, "../data/livros.json");

// Função para ler os livros do arquivo JSON
const lerLivros = () => {
    const dados = fs.readFileSync(livrosPath);
    return JSON.parse(dados);
};

const lerLivrosPorId = (id) => {
    const livros = lerLivros();
    return livros.find(livro => livro.id === id);
};

const cadastrarLivro = (novoLivro) => {
    const livros = lerLivros();
    livros.push(novoLivro);
    fs.writeFileSync(livrosPath, JSON.stringify(livros, null, 2));
};

const atualizarLivro = (id, dadosAtualizados) => {
    const livros = lerLivros();
    const indice = livros.findIndex(livro => livro.id === id);
    if (indice === -1) {
        throw new Error("Livro não encontrado");
    }
    livros[indice] = { ...livros[indice], ...dadosAtualizados };
    fs.writeFileSync(livrosPath, JSON.stringify(livros, null, 2));
};

const removerLivro = (id) => {
    const livros = lerLivros();
    const indice = livros.findIndex(livro => livro.id === id);
    if (indice === -1) {
        throw new Error("Livro não encontrado");
    }
    livros.splice(indice, 1);
    fs.writeFileSync(livrosPath, JSON.stringify(livros, null, 2));
};

module.exports = {
    lerLivros,
    lerLivrosPorId,
    cadastrarLivro,
    atualizarLivro,
    removerLivro,
};