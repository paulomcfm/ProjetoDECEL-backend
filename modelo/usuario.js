import UsuarioDAO from "../persistencia/usuarioDAO.js";

export default class Usuario {
    #nome;
    #senha;
    #cpf;
    #email;
    #celular;

    constructor(nome='',senha='',cpf='',email='',celular=''){
        this.#nome = nome;
        this.#senha = senha;
        this.#cpf = cpf;
        this.#email = email;
        this.#celular = celular;
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

    toJSON(){
        return {
            nome: this.#nome,
            senha: this.#senha,
            cpf: this.#cpf,
            email: this.#email,
            celular: this.#celular
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
}