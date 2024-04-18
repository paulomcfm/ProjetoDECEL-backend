import UsuarioDAO from "../persistencia/usuarioDAO";

export default class Usuario {
    #codigo;
    #nome;
    #senha;
    #cpf;
    #email;
    #celular;
    #categoria;

    constructor(codigo=0, nome='',senha='',cpf='',email='',celular='',categoria=''){
        this.#codigo = codigo;
        this.#nome = nome;
        this.#senha = senha;
        this.#cpf = cpf;
        this.#email = email;
        this.#celular = celular;
        this.#categoria = categoria;
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

    get senha() {
        return this.#senha;
    }

    set senha(novaSenha) {
        this.#senha = novaSenha;
    }

    get cpf() {
        return this.#cpf;
    }

    set cpf(novoCpf) {
        this.#cpf = novoCpf;
    }

    get email() {
        return this.#email;
    }

    set email(novoEmail) {
        this.#email = novoEmail;
    }

    get celular() {
        return this.#celular;
    }

    set celular(novoCelular) {
        this.#celular = novoCelular;
    }

    get categoria() {
        return this.#categoria;
    }

    set categoria(novaCategoria) {
        this.#categoria = novaCategoria;
    }

    toJSON(){
        return {
            codigo: this.#codigo,
            nome: this.#nome,
            senha: this.#senha,
            cpf: this.#cpf,
            email: this.#email,
            celular: this.#celular,
            categoria: this.#categoria
        }
    }

    async gravar() {
        const userDAO = new UsuarioDAO();
        await userDAO.gravar(this);
    }

    async excluir() {
        const userDAO = new UsuarioDAO();
        await userDAO.excluir(this);
    }

    async atualizar() {
        const userDAO = new UsuarioDAO();
        await userDAO.atualizar(this);
    }

    async consultar(parametro) {
        const userDAO = new UsuarioDAO();
        return await userDAO.consultar(parametro);
    }
}