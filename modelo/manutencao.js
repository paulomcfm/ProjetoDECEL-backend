import ManutencaoDAO from "../persistencia/manutencaoDAO.js";

export default class Manutencao {
    #codigo; // Código da manutenção
    #tipo;
    #data;
    #observacoes;
    #veiculoCodigo; // Código do veículo relacionado à manutenção

    constructor(tipo='', data='', observacoes='', veiculoCodigo= 1, codigo= 0) {
        this.#codigo = codigo;
        this.#tipo = tipo;
        this.#data = data;
        this.#observacoes = observacoes;
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
}