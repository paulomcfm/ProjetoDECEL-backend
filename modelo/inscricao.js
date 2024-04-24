import InscricaoDAO from "../persistencia/inscricaoDAO.js";

export default class Inscricao {
    #ano
    #aluno;
    #pontoEmbarque;
    #escola;
    #rota
    #cep;
    #rua;
    #numero;
    #bairro;
    #periodo;
    #etapa;
    #anoLetivo;
    #turma;
    #dataAlocacao;

    constructor(ano='', aluno = [], pontoEmbarque = [], escola = [], rota = [], cep = '', rua = '', numero = 0, bairro = '', periodo = '', etapa = '', anoLetivo = '', turma = '', dataAlocacao = '') {
        this.#ano = ano;
        this.#aluno = aluno;
        this.#pontoEmbarque = pontoEmbarque;
        this.#escola = escola;
        this.#rota = rota;
        this.#cep = cep;
        this.#rua = rua;
        this.#numero = numero;
        this.#bairro = bairro;
        this.#periodo = periodo;
        this.#etapa = etapa;
        this.#anoLetivo = anoLetivo;
        this.#turma = turma;
        this.#dataAlocacao = dataAlocacao;
    }

    get ano() {
        return this.#ano;
    }

    set ano(novoAno) {
        this.#ano = novoAno;
    }

    get aluno() {
        return this.#aluno;
    }

    set aluno(novoAluno) {
        this.#aluno = novoAluno;
    }

    get pontoEmbarque() {
        return this.#pontoEmbarque;
    }

    set pontoEmbarque(novoPontoEmbarque) {
        this.#pontoEmbarque = novoPontoEmbarque;
    }

    get escola() {
        return this.#escola;
    }

    set escola(novaEscola) {
        this.#escola = novaEscola;
    }

    get rota() {
        return this.#rota;
    }

    set rota(novaRota) {
        this.#rota = novaRota;
    }   

    get cep() {
        return this.#cep;
    }

    set cep(novoCep) {
        this.#cep = novoCep;
    }

    get rua() {
        return this.#rua;
    }

    set rua(novaRua) {
        this.#rua = novaRua;
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

    get periodo() {
        return this.#periodo;
    }

    set periodo(novoPeriodo) {
        this.#periodo = novoPeriodo;
    }

    get etapa() {
        return this.#etapa;
    }

    set etapa(novaEtapa) {
        this.#etapa = novaEtapa;
    }

    get anoLetivo() {
        return this.#anoLetivo;
    }

    set anoLetivo(novoAnoLetivo) {
        this.#anoLetivo = novoAnoLetivo;
    }

    get turma() {
        return this.#turma;
    }

    set turma(novaTurma) {
        this.#turma = novaTurma;
    }

    get dataAlocacao() {
        return this.#dataAlocacao;
    }

    set dataAlocacao(novaDataAlocacao) {
        this.#dataAlocacao = novaDataAlocacao;
    }

    toJSON() {
        return {
            ano: this.#ano,
            aluno: this.#aluno,
            pontoEmbarque: this.#pontoEmbarque,
            escola: this.#escola,
            rota: this.#rota,
            cep: this.#cep,
            rua: this.#rua,
            numero: this.#numero,
            bairro: this.#bairro,
            periodo: this.#periodo,
            etapa: this.#etapa,
            anoLetivo: this.#anoLetivo,
            turma: this.#turma,
            dataAlocacao: this.#dataAlocacao
        }
    }

    async gravar() {
        const inscDAO = new InscricaoDAO();
        await inscDAO.gravar(this);
    }

    async excluir() {
        const inscDAO = new InscricaoDAO();
        await inscDAO.excluir(this);
    }

    async atualizar() {
        const inscDAO = new InscricaoDAO();
        await inscDAO.atualizar(this);
    }

    async consultar(parametro) {
        const inscDAO = new InscricaoDAO();
        return await inscDAO.consultar(parametro);
    }

    async atualizarRota() {
        const inscDAO = new InscricaoDAO();
        await inscDAO.atualizarRota(this);
    }

    async consultarPorRota(parametro) {
        const inscDAO = new InscricaoDAO();
        return await inscDAO.consultarPorRota(parametro);
    }
}