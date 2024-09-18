export default class ContasPagar{
    #codigo;
    #valor;
    #vencimento;
    #descricao;

    constructor(codigo = 0, valor = 0, vencimento = '', descricao = ''){
        this.#codigo = codigo;
        this.#valor = valor;
        this.#vencimento = vencimento;
        this.#descricao = descricao;
    }

    get codigo() {
        return this.#codigo;
    }

    set codigo(novoCodigo) {
        this.#codigo = novoCodigo;
    }

    get valor() {
        return this.#valor;
    }

    set valor(novoValor) {
        this.#valor = novoValor;
    }

    get vencimento() {
        return this.#vencimento;
    }

    set vencimento(novoVencimento) {
        this.#vencimento = novoVencimento;
    }

    get descricao() {
        return this.#descricao;
    }

    set descricao(novaDescricao) {
        this.#descricao = novaDescricao;
    }

    toJSON() {
        return {
            codigo: this.#codigo,
            valor: this.#valor,
            vencimento: this.#vencimento,
            descricao: this.#descricao
        };
    }
}