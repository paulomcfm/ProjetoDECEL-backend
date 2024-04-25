import EscolaDAO from "../persistencia/escolaDAO.js";

export default class Escola {
    #codigo;
    #nome;
    #tipo;
    #email;
    #telefone;
    #pontoEmbarque;    

    constructor(codigo = 0, nome = '', tipo = '', email = '', telefone = '', pontoEmbarque = []) {
        this.#codigo = codigo;
        this.#nome = nome;
        this.#tipo = tipo;
        this.#email = email;
        this.#telefone = telefone;
        this.#pontoEmbarque = pontoEmbarque;
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

    get tipo() {
        return this.#tipo;
    }

    set tipo(novoTipo) {
        this.#tipo = novoTipo;
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

    get pontoEmbarque() {
        return this.#pontoEmbarque;
    }

    set pontoEmbarque(novoPontoEmbarque) {
        this.#pontoEmbarque = novoPontoEmbarque;
    }

    toJSON() {
        return {
            codigo: this.#codigo,
            nome: this.#nome,
            tipo: this.#tipo,
            email: this.#email,
            telefone: this.#telefone,
            pontoEmbarque: this.#pontoEmbarque
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

    async consultarPorPonto(parametro) {
        const escDAO = new EscolaDAO();
        return await escDAO.consultarPorPonto(parametro);
    }
}