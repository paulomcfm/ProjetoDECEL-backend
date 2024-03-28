import EscolaDAO from "../persistencia/escolaDAO.js";

export default class Escola {
    #codigo;
    #nome;
    #tipo;
    #rua;
    #numero;
    #cidade;
    #bairro;
    #cep;
    #email;
    #telefone;

    constructor(codigo = 0, nome = '', tipo = '', rua = '', numero = 0, cidade = '', bairro = '', cep = '', email = '', telefone = '') {
        this.#codigo = codigo;
        this.#nome = nome;
        this.#tipo = tipo;
        this.#rua = rua;
        this.#numero = numero;
        this.#cidade = cidade;
        this.#bairro = bairro;
        this.#cep = cep;
        this.#email = email;
        this.#telefone = telefone;
    }

    get codigo() {
        return this.#codigo;
    }

    set codigo(novoCodigo) {
        this.#codigo = novoCodigo;
    }

    get nome() {
        return this.#nome;
    }

    set nome(novoNome) {
        this.#nome = novoNome;
    }

    get tipo() {
        return this.#tipo;
    }

    set tipo(novoTipo) {
        this.#tipo = novoTipo;
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

    get cidade() {
        return this.#cidade;
    }

    set cidade(novaCidade) {
        this.#cidade = novaCidade;
    } 

    get bairro() {
        return this.#bairro;
    }

    set bairro(novoBairro) {
        this.#bairro = novoBairro;
    } 

    get cep() {
        return this.#cep;
    }

    set cep(novoCep) {
        this.#cep = novoCep;
    } 

    get email() {
        return this.#email;
    }

    set email(novoEmail) {
        this.#email = novoEmail;
    } 

    get telefone() {
        return this.#telefone;
    }

    set telefone(novoTelefone) {
        this.#telefone = novoTelefone;
    } 

    toJSON() {
        return {
            codigo: this.#codigo,
            nome: this.#nome,
            tipo: this.#tipo,
            rua: this.#rua,
            numero: this.#numero,
            cidade: this.#cidade,
            bairro: this.#bairro,
            cep: this.#cep,
            email: this.#email,
            telefone: this.#telefone
        }
    }

    async gravar() {
        const escDAO = new EscolaDAO();
        await escDAO.gravar(this);
    }

    async excluir() {
        const escDAO = new EscolaDAO();
        await escDAO.excluir(this);
    }

    async atualizar() {
        const escDAO = new EscolaDAO();
        await escDAO.atualizar(this);
    }

    async consultar(parametro) {
        const escDAO = new EscolaDAO();
        return await escDAO.consultar(parametro);
    }
}