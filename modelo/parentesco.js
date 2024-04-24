import ParentescoDAO from "../persistencia/parentescoDAO.js";

export default class Parentesco {
    #codigoAluno;
    #codigoResponsavel;
    #parentesco;

    constructor(codigoAluno = 0, codigoResponsavel= 0, parentesco= '') {
        this.#codigoAluno=codigoAluno;
        this.#codigoResponsavel=codigoResponsavel;
        this.#parentesco=parentesco;
    }

    get codigoAluno() {
        return this.#codigoAluno;
    }

    set codigoAluno(novoCodigoAluno) {
        this.#codigoAluno = novoCodigoAluno;
    }

    get codigoResponsavel() {
        return this.#codigoResponsavel;
    }

    set codigoResponsavel(novoCodigoResponsavel) {
        this.#codigoResponsavel = novoCodigoResponsavel;
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
            codigoAluno: this.#codigoAluno,
            codigoResponsavel: this.#codigoResponsavel,
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