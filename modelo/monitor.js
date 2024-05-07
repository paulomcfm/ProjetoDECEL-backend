import MonitorDAO from "../persistencia/monitorDAO.js"

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

    toJSON(){
        return (
                {
                codigo:this.#codigo,
                nome:this.#nome,
                cpf:this.#cpf,
                celular:this.#celular
                }
            )
    }


    async gravar(client){
        try{
            await new MonitorDAO().gravar(client,this)
        }catch(erro){
            
        }
    }

    async atualizar(client){
        try{
            await new MonitorDAO().atualizar(client,this)
        }catch(erro){
            
        }
    }

    async excluir(client,termo){
        try{
            await new MonitorDAO().excluir(client,termo)
        }catch(erro){
            throw erro
        }
    }

    async consultar(client,termo){
        try{
            return await new MonitorDAO().consultar(client,termo)
        }catch(erro){
            throw erro
        }
    }

}