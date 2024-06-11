import UsuarioDAO from "../persistencia/usuarioDAO.js";

export default class Usuario {
    #nome;
    #senha;
    #cpf;
    #email;
    #celular;
    #nivel;

    constructor(nome='',senha='',cpf='',email='',celular='',nivel=''){
        this.#nome = nome;
        this.#senha = senha;
        this.#cpf = cpf;
        this.#email = email;
        this.#celular = celular;
        this.#nivel = nivel;
    }

    get nome() {
        return this.#nome;
    }

    set nome(novoNome) {
        this.#nome = novoNome;
    }

    get senha() {
        return this.#senha;
    }

    set senha(novaSenha) {
        this.#senha = novaSenha;
    }

    get cpf() {
        return this.#cpf;
    }

    set cpf(novoCpf) {
        this.#cpf = novoCpf;
    }

    get email() {
        return this.#email;
    }

    set email(novoEmail) {
        this.#email = novoEmail;
    }

    get celular() {
        return this.#celular;
    }

    set celular(novoCelular) {
        this.#celular = novoCelular;
    }

    get nivel() {
        return this.#nivel;
    }

    set nivel(novoNivel) {
        this.#nivel = novoNivel;
    }

    toJSON(){
        return {
            nome: this.#nome,
            senha: this.#senha,
            cpf: this.#cpf,
            email: this.#email,
            celular: this.#celular,
            nivel: this.#nivel
        }
    }

    async gravar(client) {
        const userDAO = new UsuarioDAO();
        await userDAO.gravar(this, client);
    }

    async excluir(client) {
        const userDAO = new UsuarioDAO();
        await userDAO.excluir(this, client);
    }

    async atualizar(client) {
        const userDAO = new UsuarioDAO();
        await userDAO.atualizar(this, client);
    }

    async consultarCPF(parametro, client){
        const userDAO = new UsuarioDAO();
        return await userDAO.consultarCPF(parametro, client);
    }

    async consultar(client) {
        const userDAO = new UsuarioDAO();
        return await userDAO.consultar(client);
    }

    async consultarEmail(email, client) {
        const userDAO = new UsuarioDAO();
        return await userDAO.consultarEmail(email, client);
    }

    async salvarCodigoRedefinicao(cpf, codigo, client) {
        const userDAO = new UsuarioDAO();
        await userDAO.salvarCodigoRedefinicao(cpf, codigo, client);
    }

    async verificarCodigoRedefinicao(email, codigo, client) {
        const userDAO = new UsuarioDAO();
        return await userDAO.verificarCodigoRedefinicao(email, codigo, client);
    }

    async redefinirSenha(email, novaSenha, client) {
        const userDAO = new UsuarioDAO();
        await userDAO.redefinirSenha(email, novaSenha, client);
    }

    async removerCodigoRedefinicao(email, client) {
        const userDAO = new UsuarioDAO();
        await userDAO.removerCodigoRedefinicao(email, client);
    }
}