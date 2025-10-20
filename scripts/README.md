Scripts customizados:

- node scripts/seed-sequelize-from-json.js  => popula a tabela `livros` a partir de `src/data/livros.json`
- node scripts/migrate-up.js                => aplica a migration 001 (cria tabela `livros`)
- node scripts/migrate-down.js              => reverte a migration 001 (drop table `livros`)

Observação: esses scripts usam a instância Sequelize em `src/database/index.js` e não dependem de `sequelize-cli`. Para uso em produção, considere adotar `sequelize-cli` e manter um histórico de migrations aplicado.
