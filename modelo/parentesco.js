import ParentescoDAO from "../persistencia/parentescoDAO.js";

export default class Parentesco {
    #codigoAluno;
    #codigoResponsavel;
    #parentesco;

    constructor(codigoAluno = '', codigoResponsavel= '', parentesco= '') {
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

    async gravar() {
        const parDAO = new ParentescoDAO();
        await parDAO.gravar(this);
    }

    async excluir() {
        const parDAO = new ParentescoDAO();
        await parDAO.excluir(this);
    }

    async atualizar() {
        const parDAO = new ParentescoDAO();
        await parDAO.atualizar(this);
    }

    async consultar(parametro) {
        const parDAO = new ParentescoDAO();
        return await parDAO.consultar(parametro);
    }
}