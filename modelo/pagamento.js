import PagamentoDAO from "../persistencia/pagamentoDAO.js";

export default class Pagamento {
    #codigo;
    #mes;
    #ano;
    #valorPagamento;
    #status;
    #tipo;

    constructor(codigo = 0, mes = '', ano = '', valorPagamento = '') {
        this.#mes = mes;
        this.#ano = ano;
        this.#valorPagamento = valorPagamento;
    }

    get codigo() {
        return this.#codigo;
    }

    set codigo(novoCodigo) {
        this.#codigo = novoCodigo;
    }

    get mes() {
        return this.#mes;
    }

    set mes(novoMes) {
        this.#mes = novoMes;
    }

    get ano() {
        return this.#ano;
    }

    set ano(novoAno) {
        this.#ano = novoAno;
    }

    get valorPagamento() {
        return this.#valorPagamento;
    }

    set valorPagamento(novoValorPagamento) {
        this.#valorPagamento = novoValorPagamento;
    }

    toJSON() {
        return {
            codigo: this.#codigo,
            mes: this.#mes,
            ano: this.#ano,
            valorPagamento: this.#valorPagamento
        };
    }

    async gravar(client) {
        const pagDAO = new PagamentoDAO();
        await pagDAO.gravar(this, client);
    }

    async excluir(client) {
        const pagDAO = new PagamentoDAO();
        await pagDAO.excluir(this, client);
    }

    async atualizar(client) {
        const pagDAO = new PagamentoDAO();
        await pagDAO.atualizar(this, client);
    }

    async consultar(parametro, client) {
        const pagDAO = new PagamentoDAO();
        return await pagDAO.consultar(parametro, client);
    }
}