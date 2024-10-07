import RecebimentoDao from "../persistencia/RecebimentoDao.js";

export default class Recebimento {
    #codigo;
    #tipo;
    #valorRecebimento;
    #status;
    #aluno;
    #mes;
    #ano;
    #calculo;

    constructor(codigo=0, tipo='', valorRecebimento='', status='', aluno='', mes='', ano='', calculo='') {
        this.#tipo = tipo;
        this.#valorRecebimento = valorRecebimento;
        this.#status = status;
        this.#aluno = aluno;
        this.#mes = mes;
        this.#ano = ano;
        this.#calculo = calculo;
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

    get valorRecebimento() {
        return this.#valorRecebimento;
    }

    set valorRecebimento(novoValorRecebimento) {
        this.#valorRecebimento = novoValorRecebimento;
    }

    get status() {
        return this.#status;
    }

    set status(novoStatus) {
        this.#status = novoStatus;
    }

    get aluno() {
        return this.#aluno;
    }

    set aluno(novoAluno) {
        this.#aluno = novoAluno;
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

    get calculo() {
        return this.#calculo;
    }

    set calculo(novoCalculo) {
        this.#calculo = novoCalculo
    }

    toJSON() {
        return {
            codigo: this.#codigo,
            tipo: this.#tipo,
            valorRecebimento: this.#valorRecebimento,
            status: this.#status,
            aluno: this.#aluno,
            mes: this.#mes,
            ano: this.#ano,
            calculo: this.#calculo
        }
    }

    async gravar(client) {
        const recebDAO = new RecebimentoDao();
        await recebDAO.gravar(this, client);
    }

    async excluir(client) {
        const recebDAO = new RecebimentoDao();
        await recebDAO.excluir(this, client);
    }

    async atualizar(client) {
        const recebDAO = new RecebimentoDao();
        await recebDAO.atualizar(this, client);
    }

    async consultar(parametro, client) {
        const recebDAO = new RecebimentoDao();
        return await recebDAO.consultar(parametro, client);
    }
}