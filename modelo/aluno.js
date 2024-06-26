import AlunoDAO from "../persistencia/alunoDAO.js";

export default class Aluno {
    #codigo;
    #nome;
    #rg;
    #observacoes;
    #dataNasc;
    #celular;
    #responsaveis = [];
    #status;
    #motivoInativo;

    constructor(codigo = 0, nome = '', rg = '', observacoes = '', dataNasc = '', celular = '', responsaveis = [], status = '', motivoInativo = '') {
        this.#codigo = codigo;
        this.#nome = nome;
        this.#rg = rg;
        this.#observacoes = observacoes;
        this.#dataNasc = dataNasc;
        this.#celular = celular;
        this.#responsaveis = responsaveis;
        this.#status = status;
        this.#motivoInativo = motivoInativo;
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

    get observacoes() {
        return this.#observacoes;
    }

    set observacoes(novaObservacao) {
        this.#observacoes = novaObservacao;
    }

    get dataNasc() {
        return this.#dataNasc;
    }

    set dataNasc(novaDataNasc) {
        this.#dataNasc = novaDataNasc;
    }

    get celular() {
        return this.#celular;
    }

    set celular(novoCelular) {
        this.#celular = novoCelular;
    }

    get responsaveis() {
        return this.#responsaveis;
    }

    set responsaveis(novoResponsavel) {
        this.#responsaveis = novoResponsavel;
    }

    get status() {
        return this.#status;
    }

    set status(novoStatus) {
        this.#status = novoStatus;
    }

    get motivoInativo() {
        return this.#motivoInativo;
    }

    set motivoInativo(novoMotivoInativo) {
        this.#motivoInativo = novoMotivoInativo;
    }

    validarDataNascimento(data) {
        const targetDate = new Date(data);
        const currentDate = new Date();
        const past100Years = new Date(currentDate.getFullYear() - 100, currentDate.getMonth(), currentDate.getDate());
      
        return targetDate <= currentDate && targetDate >= past100Years;
    }

    toJSON() {
        return {
            codigo: this.#codigo,
            nome: this.#nome,
            rg: this.#rg,
            observacoes: this.#observacoes,
            dataNasc: this.#dataNasc,
            celular: this.#celular,
            responsaveis: this.#responsaveis,
            status: this.#status,
            motivoInativo: this.#motivoInativo
        }
    }

    async gravar(client) {
        const aluDAO = new AlunoDAO();
        await aluDAO.gravar(this, client);
    }

    async excluir(client) {
        const aluDAO = new AlunoDAO();
        await aluDAO.excluir(this, client);
    }

    async atualizar(client) {
        const aluDAO = new AlunoDAO();
        await aluDAO.atualizar(this, client);
    }

    async consultar(parametro, client) {
        const aluDAO = new AlunoDAO();
        return await aluDAO.consultar(parametro, client);
    }
}