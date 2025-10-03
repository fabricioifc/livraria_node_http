/**
 * Middleware de tratamento de erros
 * Este middleware captura e trata todos os erros da aplicação
 */

const errorHandler = (err, req, res, next) => {
    console.error('❌ Erro capturado:', err.message);

    if (process.env.NODE_ENV === 'development') {
        // Em desenvolvimento: retorna detalhes completos do erro
        res.status(500).json({
            erro: "Erro interno do servidor",
            mensagem: err.message,
            stack: err.stack,
            timestamp: new Date().toISOString(),
            url: req.originalUrl,
            method: req.method
        });
    } else {
        // Em produção: retorna apenas mensagem genérica
        res.status(500).json({
            erro: "Erro interno do servidor",
            timestamp: new Date().toISOString()
        });
    }
};

module.exports = errorHandler;