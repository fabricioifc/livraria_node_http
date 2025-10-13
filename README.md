# Livraria

Este projeto é uma aplicação web simples para praticar conceitos básicos de desenvolvimento web, incluindo principalmente o protocolo HTTP, HTML, CSS e JavaScript. A aplicação simula uma livraria onde os usuários podem cadastrar, visualizar, editar e excluir livros.

## Banco de Dados (SQLite + Prisma)

Este projeto usa SQLite com Prisma ORM.

- Arquivo do banco: `src/data/livraria.db`
- URL de conexão em `.env`:

```
DATABASE_URL="file:./src/data/livraria.db"
```

### Migrações e Client

- Gerar/atualizar client Prisma:

```bash
npx prisma generate
```

- Criar/aplicar migração (dev):

```bash
npx prisma migrate dev --name <nome>
```

### Seed

O seed lê `src/data/livros.json` se existir; caso contrário, usa dados padrão.

```bash
npx prisma db seed
```

## Como Testar

Para testar os endpoints da aplicação, você pode usar ferramentas como Postman ou cURL. Abaixo estão os endpoints disponíveis:

- `GET /`: Retorna a página inicial da aplicação.

```bash
curl http://localhost:3000/
```

- `GET /livros`: Retorna uma lista de todos os livros cadastrados.
```bash
curl http://localhost:3000/api/livros
```

- `GET /livros/:id`: Retorna os detalhes de um livro específico pelo seu ID.
```bash
curl http://localhost:3000/api/livros/1
```

- `POST /livros`: Adiciona um novo livro. O corpo da requisição deve conter os detalhes do livro em formato JSON.
```bash
# Livro de informática
curl -X POST http://localhost:3000/api/livros -H "Content-Type: application/json" -d '{"titulo": "Novo Livro", "autor": "Autor Exemplo", "ano": 2024, "categoria": "Informática"}'
```

- `PUT /livros/:id`: Atualiza os detalhes de um livro existente pelo seu ID. O corpo da requisição deve conter os novos detalhes do livro em formato JSON.
```bash
curl -X PUT http://localhost:3000/api/livros/4 -H "Content-Type: application/json" -d '{"titulo": "Livro Atualizado", "autor": "Autor Atualizado", "ano": 2025, "categoria": "Ficção"}'
```

- `DELETE /livros/:id`: Remove um livro pelo seu ID.
```bash
curl -X DELETE http://localhost:3000/api/livros/4
```

