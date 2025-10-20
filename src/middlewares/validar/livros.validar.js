const validarParamId = (req, res, next) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ erro: "ID deve ser um número válido" });
    }
    next();
}

module.exports = { validarParamId };