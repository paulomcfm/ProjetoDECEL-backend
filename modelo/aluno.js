import AlunoDAO from "../persistencia/alunoDAO.js";

export default class Aluno {
    #codigo;
    #nome;
    #rg;
    #observacoes;
    #dataNasc;
    #responsaveis;

    constructor(codigo = 0, nome = '', rg = '', observacoes = '', dataNasc = '') {
        this.#codigo = codigo;
        this.#nome = nome;
        this.#rg = rg;
        this.#observacoes = observacoes;
        this.#dataNasc = dataNasc;
        this.#responsaveis = [];
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

    get responsaveis() {
        return this.#responsaveis;
    }

    set responsaveis(novoResponsavel) {
        this.#responsaveis = novoResponsavel;
    }

    validarDataNascimento(data) {
        const targetDate = new Date(data);
        const currentDate = new Date();
        const past100Years = new Date(currentDate.getFullYear() - 100, currentDate.getMonth(), currentDate.getDate());
      
        return targetDate <= currentDate && targetDate >= past100Years;
      }

    validarRg(rg) {
        return /^\d{2}\.\d{3}\.\d{3}-[\dxX]$/.test(rg);
    }

    toJSON() {
        return {
            codigo: this.#codigo,
            nome: this.#nome,
            rg: this.#rg,
            observacoes: this.#observacoes,
            dataNasc: this.#dataNasc,
            responsaveis: this.#responsaveis
        }
    }

    async gravar() {
        const aluDAO = new AlunoDAO();
        await aluDAO.gravar(this);
    }

    async excluir() {
        const aluDAO = new AlunoDAO();
        await aluDAO.excluir(this);
    }

    async atualizar() {
        const aluDAO = new AlunoDAO();
        await aluDAO.atualizar(this);
    }

    async consultar(parametro) {
        const aluDAO = new AlunoDAO();
        return await aluDAO.consultar(parametro);
    }
}