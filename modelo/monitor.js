export default class Monitor{
    #codigo
    #nome
    #cpf
    #celular

    constructor(codigo,nome,cpf,celular){
        this.#codigo = codigo
        this.#nome = nome
        this.#cpf = cpf
        this.#celular = celular
    }

    get codigo(){
        return this.#codigo
    }

    set codigo(novoCodigo){
        this.#codigo = novoCodigo
    }

    
    get nome(){
        return this.#nome
    }

    set nome(novoNome){
        this.#nome = novoNome
    }

    get cpf(){
        return this.#cpf
    }

    set cpf(novoCpf){
        this.#cpf = novoCpf
    }

    get celular(){
        return this.#celular
    }

    set celular(novoCelular){
        this.#celular = novoCelular
    }


    async gravar(client){

    }

    async atualizar(client){

    }

    async excluir(client){

    }

    async consultar(client){

    }

}