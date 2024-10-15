import ResponsavelDAO from "../persistencia/responsavelDAO.js";
import InterfaceObserver from "./interfaceObserver.js";

export default class Responsavel extends InterfaceObserver{
    #codigo;
    #nome;
    #rg;
    #cpf;
    #email;
    #telefone;
    #celular;
    #alunos = [];

    update(){
        console.log(`Responsavel ${this.#nome} notificado!`);
    }

    constructor(codigo = 0, nome = '', rg = '', cpf = '', email = '', telefone = '', celular = '', alunos =[]) {
        super()
        this.#codigo = codigo;
        this.#nome = nome;
        this.#rg = rg;
        this.#cpf = cpf;
        this.#email = email;
        this.#telefone = telefone;
        this.#celular = celular;
        this.#alunos = alunos;
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

    async gravar(client) {
        const respDAO = new ResponsavelDAO();
        await respDAO.gravar(this, client);
    }

    async excluir(client) {
        const respDAO = new ResponsavelDAO();
        await respDAO.excluir(this, client);
    }

    async atualizar(client) {
        const respDAO = new ResponsavelDAO();
        await respDAO.atualizar(this, client);
    }

    async consultar(parametro, client) {
        const respDAO = new ResponsavelDAO();
        return await respDAO.consultar(parametro, client);
    }
}