import VeiculoDAO from "../persistencia/veiculoDAO.js";

export default class Veiculo {
    #codigo;
    #renavam;
    #placa;
    #modelo;
    #capacidade;
    #tipo;

    constructor(codigo = 0, renavam = '', placa = '', modelo = '', capacidade = '', tipo = '') {
        this.#codigo = codigo;
        this.#renavam = renavam;
        this.#placa = placa;
        this.#modelo = modelo;
        this.#capacidade = capacidade;
        this.#tipo = tipo;
    }

    get codigo() {
        return this.#codigo;
    }

    set codigo(novoCodigo) {
        this.#codigo = novoCodigo;
    }

    get renavam() {
        return this.#renavam;
    }

    set renavam(novoRenavam) {
        this.#renavam = novoRenavam;
    }

    get placa() {
        return this.#placa;
    }

    set placa(novaPlaca) {
        this.#placa = novaPlaca;
    }

    get modelo() {
        return this.#modelo;
    }

    set modelo(novoModelo) {
        this.#modelo = novoModelo;
    }

    get capacidade() {
        return this.#capacidade;
    }

    set capacidade(novaCapacidade) {
        this.#capacidade = novaCapacidade;
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
            renavam: this.#renavam,
            placa: this.#placa,
            modelo: this.#modelo,
            capacidade: this.#capacidade,
            tipo: this.#tipo
        }
    }

    async gravar(client) {
        const veiDAO = new VeiculoDAO();
        await veiDAO.gravar(this, client);
    }

    async excluir(client) {
        const veiDAO = new VeiculoDAO();
        await veiDAO.excluir(this, client);
    }

    async atualizar(client) {
        const veiDAO = new VeiculoDAO();
        await veiDAO.atualizar(this, client);
    }

    async consultar(parametro, client) {
        const veiDAO = new VeiculoDAO();
        return await veiDAO.consultar(parametro, client);
    }
}