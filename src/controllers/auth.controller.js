const bcrypt = require('bcrypt');
const UsersRepository = require('../repositories/users.repository');

class AuthController {
    constructor() {
        this.usersRepo = new UsersRepository();
    }

    async register(req, res, next) {
        try {
            const { username, email, password } = req.body;
            if (!username || !email || !password) {
                return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' });
            }
            if (this.usersRepo.findByUsername(username)) {
                return res.status(409).json({ erro: 'Usuário já existe.' });
            }
            if (this.usersRepo.findByEmail(email)) {
                return res.status(409).json({ erro: 'Email já cadastrado.' });
            }
            const hash = await bcrypt.hash(password, 10);
            const user = this.usersRepo.create({ username, email, password: hash });
            req.session.userId = user.id;
            res.status(201).json({ mensagem: 'Usuário registrado com sucesso!', user: user.toJSON() });
        } catch (err) {
            next(err);
        }
    }

    async login(req, res, next) {
        try {
            const { username, password } = req.body;
            const user = this.usersRepo.findByUsername(username);
            if (!user) {
                return res.status(401).json({ erro: 'Usuário ou senha inválidos.' });
            }
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                return res.status(401).json({ erro: 'Usuário ou senha inválidos.' });
            }
            req.session.userId = user.id;
            res.status(200).json({ mensagem: 'Login realizado com sucesso!', user: user.toJSON() });
        } catch (err) {
            next(err);
        }
    }

    async me(req, res, next) {
        try {
            if (!req.session.userId) {
                return res.status(401).json({ erro: 'Não autenticado.' });
            }
            const user = this.usersRepo.findById(req.session.userId);
            if (!user) {
                return res.status(404).json({ erro: 'Usuário não encontrado.' });
            }
            res.status(200).json({ user: user.toJSON() });
        } catch (err) {
            next(err);
        }
    }

    async logout(req, res, next) {
        req.session.destroy(() => {
            res.status(200).json({ mensagem: 'Logout realizado com sucesso.' });
        });
    }
}

module.exports = AuthController;
