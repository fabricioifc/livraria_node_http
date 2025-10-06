// Este middleware captura e trata todos os erros da aplicação
const errorHandler = (err, req, res, next) => {
    console.error('❌ Erro capturado:', err.message);

    // Determina o status code baseado no erro
    const statusCode = err.statusCode || 500;

    if (process.env.NODE_ENV === 'development') {
        // Em desenvolvimento: retorna detalhes completos do erro
        res.status(statusCode).json({
            erro: statusCode === 500 ? "Erro interno do servidor" : err.message,
            mensagem: err.message,
            stack: err.stack,
            timestamp: new Date().toISOString(),
            url: req.originalUrl,
            method: req.method
        });
    } else {
        // Em produção: retorna mensagem apropriada
        res.status(statusCode).json({
            erro: statusCode === 500 ? "Erro interno do servidor" : err.message,
            timestamp: new Date().toISOString()
        });
    }
};

module.exports = errorHandler;