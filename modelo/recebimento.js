import RecebimentoDao from "../persistencia/recebimentoDao.js";
import AVista from "./avista.js";

export default class Recebimento {
    #codigo;
    #tipo;
    #valorRecebimento;
    #valorMensalidade;
    #status;
    #aluno;
    #mes;
    #ano;
    #calculo;
    #qtdParcelas;

    constructor(codigo=0, tipo='', valorMensalidade='', status='', aluno='', mes='', ano='', qtdParcelas='') {
        this.#tipo = tipo;
        this.#valorMensalidade = valorMensalidade;
        this.#status = status;
        this.#aluno = aluno;
        this.#mes = mes;
        this.#ano = ano;
        this.#qtdParcelas = qtdParcelas;
        this.#calculo = new AVista();
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

    get valorMensalidade() {
        return this.#valorMensalidade;
    }

    set valorMensalidade(novoValorMensalidade) {
        this.#valorMensalidade = novoValorMensalidade;
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

    get qtdParcelas() {
        return this.#qtdParcelas;
    }

    set qtdParcelas(novoQtdParcelas) {
        this.#qtdParcelas = novoQtdParcelas;
    }

    calcularValor() {
        this.#valorRecebimento = this.#calculo.calcular(this);
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
            qtdParcelas: this.#qtdParcelas
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