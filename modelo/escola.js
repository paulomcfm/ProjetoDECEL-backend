import EscolaDAO from "../persistencia/escolaDAO.js";

export default class Escola {
    #codigo;
    #nome;
    #endereco;
    #tipo;

    constructor(codigo = 0, nome = '', endereco = '', tipo = '') {
        this.#codigo = codigo;
        this.#nome = nome;
        this.#endereco = endereco;
        this.#tipo = tipo;
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

    get endereco() {
        return this.#endereco;
    }

    set endereco(novoEndereco) {
        this.#endereco = novoEndereco;
    }

    get tipo() {
        return this.#tipo;
    }

    set tipo(novoTipo) {
        this.#tipo = novoTipo;
    }    

    toJSON() {
        return {
            codigo: this.#codigo,
            nome: this.#nome,
            endereco: this.#endereco,
            tipo: this.#tipo
        }
    }

    async gravar() {
        const escDAO = new EscolaDAO();
        await escDAO.gravar(this);
    }

    async excluir() {
        const escDAO = new EscolaDAO();
        await escDAO.excluir(this);
    }

    async atualizar() {
        const escDAO = new EscolaDAO();
        await escDAO.atualizar(this);
    }

    async consultar(parametro) {
        const escDAO = new EscolaDAO();
        return await escDAO.consultar(parametro);
    }
}