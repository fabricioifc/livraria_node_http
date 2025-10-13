// prisma/seed.js
const { PrismaClient } = require('../src/generated/prisma');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
    // Lê dados do JSON existente se houver
    const jsonPath = path.join(__dirname, '../src/data/livros.json');
    let dados = [];
    try {
        const raw = fs.readFileSync(jsonPath, 'utf-8');
        dados = JSON.parse(raw);
    } catch (e) {
        // sem seed de arquivo, cria alguns dados básicos
        dados = [
            { titulo: 'Livro A', autor: 'Autor A', categoria: 'Categoria A', ano: 2001 },
            { titulo: 'Livro B', autor: 'Autor B', categoria: 'Categoria B', ano: 2005 },
            { titulo: 'Livro C', autor: 'Autor C', categoria: 'Categoria C', ano: 2010 },
        ];
    }

    // Limpa e insere
    await prisma.livro.deleteMany();
    await prisma.livro.createMany({
        data: dados.map(d => ({
            titulo: String(d.titulo).trim(),
            autor: String(d.autor).trim(),
            categoria: String(d.categoria).trim(),
            ano: parseInt(d.ano, 10),
        }))
    });

    const count = await prisma.livro.count();
    console.log(`Seed finalizado: ${count} livros inseridos.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
