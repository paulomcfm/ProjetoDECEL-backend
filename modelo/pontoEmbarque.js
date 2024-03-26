import pontoEmbarqueDAO from "../persistencia/pontoEmbarqueDAO.js";

export default class PontoEmbarque {
    #codigo;
    #endereco;

    constructor(codigo = 0, endereco = '') {
        this.#codigo = codigo;
        this.#endereco = endereco;
    }

    get codigo() {
        return this.#codigo;
    }

    set codigo(novoCodigo) {
        this.#codigo = novoCodigo;
    }

    get endereco() {
        return this.#endereco;
    }

    set endereco(novoEndereco) {
        this.#endereco = novoEndereco;
    }

    toJSON() {
        return {
            codigo: this.#codigo,
            endereco: this.#endereco,
        }
    }

    async gravar() {
        const pdeDAO = new pontoEmbarqueDAO();
        await pdeDAO.gravar(this);
    }

    async excluir() {
        const pdeDAO = new pontoEmbarqueDAO();
        await pdeDAO.excluir(this);
    }

    async atualizar() {
        const pdeDAO = new pontoEmbarqueDAO();
        await pdeDAO.atualizar(this);
    }

    async consultar(parametro) {
        const pdeDAO = new pontoEmbarqueDAO();
        return await pdeDAO.consultar(parametro);
    }
}