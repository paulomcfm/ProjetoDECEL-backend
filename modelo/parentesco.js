import ParentescoDAO from "../persistencia/parentescoDAO.js";

export default class Parentesco {
    #aluno;
    #responsavel;
    #parentesco;

    constructor(aluno = '', responsavel= '', parentesco= '') {
        this.#aluno=aluno;
        this.#responsavel=responsavel;
        this.#parentesco=parentesco;
    }

    get aluno() {
        return this.#aluno;
    }

    set aluno(novoAluno) {
        this.#aluno = novoAluno;
    }

    get responsavel() {
        return this.#responsavel;
    }

    set responsavel(novoResponsavel) {
        this.#responsavel = novoResponsavel;
    }

    get parentesco() {
        return this.#parentesco;
    }

    set parentesco(novoParentesco) {
        this.#parentesco = novoParentesco;
    }

    validaDataNascimento(data) {
        return true;
    }
    
    toJSON() {
        return {
            aluno: this.#aluno,
            responsavel: this.#responsavel,
            parentesco: this.#parentesco
        }
    }

    async gravar(client) {
        const parDAO = new ParentescoDAO();
        await parDAO.gravar(this, client);
    }

    async excluir(client) {
        const parDAO = new ParentescoDAO();
        await parDAO.excluir(this, client);
    }

    async atualizar(client) {
        const parDAO = new ParentescoDAO();
        await parDAO.atualizar(this, client);
    }

    async consultar(parametro, client) {
        const parDAO = new ParentescoDAO();
        return await parDAO.consultar(parametro, client);
    }

    async consultarAluno(parametro, client) {
        const parDAO = new ParentescoDAO();
        return await parDAO.consultarAluno(parametro, client);
    }
    async consultarResponsavel(parametro, client) {
        const parDAO = new ParentescoDAO();
        return await parDAO.consultarResponsavel(parametro, client);
    }

}