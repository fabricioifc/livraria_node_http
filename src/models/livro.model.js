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

    static fromJSON(json) {
        // aceita tanto objetos já prontos quanto JSON puro
        return new Livro({
            id: json.id ?? null,
            titulo: json.titulo,
            autor: json.autor,
            categoria: json.categoria,
            ano: json.ano
        });
    }

    toJSON() {
        return {
            id: this.id,
            titulo: this.titulo,
            autor: this.autor,
            categoria: this.categoria,
            ano: this.ano
        };
    }

    atualizar(campos) {
        const permitido = ["titulo", "autor", "categoria", "ano"];
        for (const chave of Object.keys(campos)) {
            if (!permitido.includes(chave)) continue;
            if (chave === "ano") {
                const novoAno = Number.isInteger(campos.ano) ? campos.ano : parseInt(campos.ano, 10);
                this.ano = novoAno;
            } else {
                this[chave] = String(campos[chave]).trim();
            }
        }
        this._validar();
        return this;
    }

    _validar() {
        const erros = [];

        if (!this.titulo || this.titulo.trim().length === 0) erros.push("Título é obrigatório");
        if (!this.autor || this.autor.trim().length === 0) erros.push("Autor é obrigatório");
        if (!this.categoria || this.categoria.trim().length === 0) erros.push("Categoria é obrigatória");
        if (!Number.isInteger(this.ano) || isNaN(this.ano)) erros.push("Ano deve ser um número válido");

        if (erros.length > 0) {
            const error = new Error("Dados inválidos");
            error.statusCode = 400;
            error.details = erros;
            throw error;
        }
    }
}

module.exports = Livro;
