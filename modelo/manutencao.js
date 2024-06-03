import ManutencaoDAO from "../persistencia/manutencaoDAO.js";

export default class Manutencao{
    #codigo;
    #tipo;
    #data;
    #observacoes;
    #placa;

    constructor(codigo=0, tipo='', data='', observacoes='', placa=''){
        this.#codigo=codigo;
        this.#tipo=tipo;
        this.#data=data;
        this.#observacoes=observacoes;
        this.#placa=placa;
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

    set observacoes(novaObservacoes) {
        this.#observacoes = novaObservacoes;
    }
    get placa() {
        return this.#placa;
    }

    set placa(novaPlaca) {
        this.#placa = novaPlaca;
    }

    toJSON(){
        return{
            codigo: this.#codigo,
            tipo: this.#tipo,
            data: this.#data,
            observacoes: this.#observacoes,
            placa: this.#placa
        }
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