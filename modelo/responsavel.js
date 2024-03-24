import ResponsavelDAO from "../persistencia/responsavelDAO.js";

export default class Responsavel {
    #codigo;
    #nome;
    #rg;
    #cpf;
    #email;
    #telefone;
    #celular;
    #alunos;

    constructor(codigo = 0, nome = '', rg = '', cpf = '', email = '', telefone = '', celular = '') {
        this.#codigo = codigo;
        this.#nome = nome;
        this.#rg = rg;
        this.#cpf = cpf;
        this.#email = email;
        this.#telefone = telefone;
        this.#celular = celular;
        this.#alunos = [];
    }

    get codigo() {
        return this.#codigo;
    }

    set codigo(novoCodigo) {
        this.#codigo = novoCodigo;
    }

    get nome() {
        return this.#nome;
    }

    set nome(novoNome) {
        this.#nome = novoNome;
    }

    get rg() {
        return this.#rg;
    }

    set rg(novoRg) {
        this.#rg = novoRg;
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

    get telefone() {
        return this.#telefone;
    }

    set telefone(novoTelefone) {
        this.#telefone = novoTelefone;
    }

    get celular() {
        return this.#celular;
    }

    set celular(novoCelular) {
        this.#celular = novoCelular;
    }

    get alunos() {
        return this.#alunos;
    }

    set alunos(novoAluno) {
        this.#alunos = novoAluno;
    }


    toJSON() {
        return {
            codigo: this.#codigo,
            nome: this.#nome,
            rg: this.#rg,
            cpf: this.#cpf,
            email: this.#email,
            telefone: this.#telefone,
            celular: this.#celular,
            alunos: this.#alunos
        }
    }

    async gravar() {
        const respDAO = new ResponsavelDAO();
        await respDAO.gravar(this);
    }

    async excluir() {
        const respDAO = new ResponsavelDAO();
        await respDAO.excluir(this);
    }

    async atualizar() {
        const respDAO = new ResponsavelDAO();
        await respDAO.atualizar(this);
    }

    async consultar(parametro) {
        const respDAO = new ResponsavelDAO();
        return await respDAO.consultar(parametro);
    }
}