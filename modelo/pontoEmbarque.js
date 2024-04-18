import pontoEmbarqueDAO from "../persistencia/pontoEmbarqueDAO.js";

export default class PontoEmbarque {
    #codigo;
    #rua;
    #numero;
    #bairro;
    #cep;

    constructor(codigo = 0, rua = '', numero = 0, bairro = '', cep = '') {
        this.#codigo = codigo;
        this.#rua = rua;
        this.#numero = numero;
        this.#bairro = bairro;
        this.#cep = cep;
    }

    get codigo() {
        return this.#codigo;
    }

    set codigo(novoCodigo) {
        this.#codigo = novoCodigo;
    }

    get rua() {
        return this.#rua
    }

    set rua(novaRua) {
        this.#rua = novaRua
    }

    get numero() {
        return this.#numero;
    }

    set numero(novoNumero) {
        this.#numero = novoNumero;
    }

    get bairro() {
        return this.#bairro;
    }

    set bairro(novoBairro) {
        this.#bairro = novoBairro;
    }

    get cep() {
        return this.#cep;
    }

    set cep(novoCep) {
        this.#cep = novoCep;
    }

    toJSON() {
        return {
            codigo: this.#codigo,
            rua: this.#rua,
            numero: this.#numero,
            bairro: this.#bairro,
            cep: this.#cep
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