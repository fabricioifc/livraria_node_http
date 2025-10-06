const express = require("express");
const router = express.Router();

// Controllers
const LivrosController = require("../controllers/livros.controller");
const livrosController = new LivrosController();

// Middlewares
const { validarLivro, validarParamId } = require("../middlewares/validar/livros.validar");

router.get("/", (req, res) => livrosController.listarLivros(req, res));
router.get("/:id", validarParamId, (req, res) => livrosController.buscarLivroPorId(req, res));
router.post("/", validarLivro, (req, res) => livrosController.criarLivro(req, res));
router.put("/:id", validarParamId, validarLivro, (req, res) => livrosController.atualizarLivro(req, res));
router.delete("/:id", validarParamId, (req, res) => livrosController.removerLivro(req, res));

module.exports = router;