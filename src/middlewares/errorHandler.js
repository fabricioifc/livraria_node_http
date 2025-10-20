// Este middleware captura e trata todos os erros da aplicação
const errorHandler = (err, req, res, next) => {

    // Determina o status code baseado no erro
    const statusCode = err.statusCode || 500;
    const dev = process.env.NODE_ENV === 'development';

    // Mapeamento de erros do Sequelize (validação)
    if (err && err.name === 'SequelizeValidationError') {
        const detalhes = err.errors ? err.errors.map(e => e.message) : [err.message];
        const payload = {
            erro: 'Dados inválidos',
            detalhes,
            timestamp: new Date().toISOString()
        };
        if (dev) payload.stack = err.stack;
        return res.status(400).json(payload);
    }
    if (dev) {
        // Em desenvolvimento: retorna detalhes completos do erro
        const details = {
            erro: statusCode === 500 ? "Erro interno do servidor" : err.message,
            mensagem: err.message,
            stack: err.stack,
            timestamp: new Date().toISOString(),
            url: req.originalUrl,
            method: req.method
        };
        console.log('❌ Erro capturado:', details);

        res.status(statusCode).json(details);
    } else {
        // Em produção: retorna mensagem apropriada
        res.status(statusCode).json({
            erro: statusCode === 500 ? "Erro interno do servidor" : err.message,
            timestamp: new Date().toISOString()
        });
    }
};

module.exports = errorHandler;