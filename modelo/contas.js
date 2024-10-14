import ContasDAO from "../persistencia/contasDAO.js";

export default class Contas {
    #id;
    #valor;
    #vencimento;
    #recebimento
    #descricao;
    #status;
    #categoria;
    #dataCriacao;
    #observacoes;

    constructor(id = 0, valor = 0, descricao = '', vencimento = '', recebimento='', status = 'pendente', categoria = '', dataCriacao = new Date(), observacoes = '') 
    {
        this.#id = id;
        this.#valor = valor;
        this.#descricao = descricao;
        this.#vencimento = vencimento;
        this.#recebimento = recebimento;
        this.#status = status;
        this.#categoria = categoria;
        this.#dataCriacao = dataCriacao;
        this.#observacoes = observacoes;
    }

    get id() {
        return this.#id;
    }

    set id(novoId) {
        this.#id = novoId;
    }

    get valor() {
        return this.#valor;
    }

    set valor(novoValor) {
        this.#valor = novoValor;
    }

    get descricao() {
        return this.#descricao;
    }

    set descricao(novaDescricao) {
        this.#descricao = novaDescricao;
    }

    get vencimento() {
        return this.#vencimento;
    }

    set vencimento(novoVencimento) {
        this.#vencimento = novoVencimento;
    }

    get recebimento() {
        return this.#recebimento;
    }

    set recebimento(novoRecebimento) {
        this.#recebimento = novoRecebimento;
    }

    get status() {
        return this.#status;
    }

    set status(novoStatus) {
        this.#status = novoStatus;
    }

    get categoria() {
        return this.#categoria;
    }

    set categoria(novaCategoria) {
        this.#categoria = novaCategoria;
    }

    get dataCriacao() {
        return this.#dataCriacao;
    }

    set dataCriacao(novaDataCraicao) {
        this.#dataCriacao = novaDataCraicao;
    }

    get observacoes() {
        return this.#observacoes;
    }

    set observacoes(novasObservacoes) {
        this.#observacoes = novasObservacoes;
    }

    toJSON() {
        return {
            id: this.#id,
            valor: this.#valor,
            descricao: this.#descricao,
            vencimento: this.#vencimento,
            recebimento: this.recebimento,
            status: this.#status,
            categoria: this.#categoria,
            dataCriacao: this.#dataCriacao,
            observacoes: this.#observacoes
        };
    }

    async gravar(client) {
        const contasDAO = new ContasDAO();
        await contasDAO.gravar(this, client);
    }

    async atualizar(client) {
        const contasDAO = new ContasDAO();
        await contasDAO.atualizar(this, client);
    }

    async excluir(client) {
        const contasDAO = new ContasDAO();
        await contasDAO.excluir(this, client);
    }

    async consultar(client) {
        const contasDAO = new ContasDAO();
        await contasDAO.consultar(this, client);
    }
}