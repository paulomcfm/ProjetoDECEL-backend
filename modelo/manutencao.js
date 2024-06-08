import ManutencaoDAO from "../persistencia/manutencaoDAO.js";

export default class Manutencao{
    #codigo;
    #tipo;
    #data;
    #observacoes;
    #id;

    // Cuidado aqui, mudamos o parâmetro código de lugar
    constructor(tipo='', data='', observacoes='', id=1, codigo=0){
        this.#codigo=codigo;
        this.#tipo=tipo;
        this.#data=data;
        this.#observacoes=observacoes;
        this.#id=id;
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
    get id() {
        return this.#id;
    }

    set id(novoId) {
        this.#id = novoId;
    }

    toJSON(){
        return{
            codigo: this.#codigo,
            tipo: this.#tipo,
            data: this.#data,
            observacoes: this.#observacoes,
            id: this.#id
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