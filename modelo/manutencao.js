import ManutencaoDAO from "../persistencia/manutencaoDAO.js";

export default class Manutencao {
    #codigo; 
    #tipo;
    #data;
    #observacoes;
    #valor;
    #veiculoCodigo; 

    constructor(tipo='', data='', observacoes='', valor=0, veiculoCodigo= 1, codigo= 0) {
        this.#codigo = codigo;
        this.#tipo = tipo;
        this.#data = data;
        this.#observacoes = observacoes;
        this.#valor = valor;
        this.#veiculoCodigo = veiculoCodigo;
    }

    get codigo() {
        return this.#codigo;
    }

    set codigo(novoCodigo) {
        this.#codigo = novoCodigo;
    }

    get tipo() {
        return this.#tipo;
    }

    set tipo(novoTipo) {
        this.#tipo = novoTipo;
    }

    get data() {
        return this.#data;
    }

    set data(novaData) {
        this.#data = novaData;
    }

    get observacoes() {
        return this.#observacoes;
    }

    set observacoes(novasObservacoes) {
        this.#observacoes = novasObservacoes;
    }

    get valor() {
        return this.#valor;
    }

    set valor(novoValor) {
        this.#valor = novoValor;
    }

    get veiculoCodigo() {
        return this.#veiculoCodigo;
    }

    set veiculoCodigo(novoVeiculoCodigo) {
        this.#veiculoCodigo = novoVeiculoCodigo;
    }

    toJSON() {
        return {
            codigo: this.#codigo,
            tipo: this.#tipo,
            data: this.#data,
            observacoes: this.#observacoes,
            valor: this.#valor,
            veiculoCodigo: this.#veiculoCodigo
        };
    }

    async gravar(client) {
        const manutencaoDAO = new ManutencaoDAO();
        await manutencaoDAO.gravar(this, client);
    }

    async atualizar(client) {
        const manutencaoDAO = new ManutencaoDAO();
        await manutencaoDAO.atualizar(this, client);
    }

    async excluir(client) {
        const manutencaoDAO = new ManutencaoDAO();
        await manutencaoDAO.excluir(this, client);
    }

    async consultar(client) {
        const manutencaoDAO = new ManutencaoDAO();
        return await manutencaoDAO.consultar(client);
    }

    async consultarPorPlaca(placa, client) {
        const manutencaoDAO = new ManutencaoDAO();
        return await manutencaoDAO.consultarPorPlaca(placa, client);
    }

    async consultarPorData(placa,ini,fim, client) {
        const manutencaoDAO = new ManutencaoDAO();
        return await manutencaoDAO.consultarPorData(placa,ini,fim, client);
    }
}