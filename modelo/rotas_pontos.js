import Rotas_PontosDAO from "../persistencia/rotas_pontosDAO.js";

export default class Rotas_Pontos{

    #rota
    #pontos

    constructor(rota,pontos){
        this.#rota = rota
        this.#pontos = pontos
    }

    get rota(){
        return this.#rota
    }

    set rota(novaRota){
        this.#rota = novaRota
    }
    
    get pontos(){
        return this.#pontos
    }

    set pontos(novoPonto){
        this.#pontos = novoPonto
    }

    

    async gravar(client){
        try{
            const dao = new Rotas_PontosDAO()
            await dao.gravar(client,this)
        }catch(erro){
            throw erro
        }
    }
    async atualizar(client){
        const dao = new Rotas_PontosDAO()
        
        await dao.deletar(client,this)
        await dao.gravar(client,this)
    }
    async deletar(client,rotaCodigo){
        try{
            const dao = new Rotas_PontosDAO()
            await dao.deletar(client,rotaCodigo)
        }catch(erro){
            throw erro
        }
    }

    async consultar(client){
        try{
            const dao = new Rotas_PontosDAO()
            return await dao.consultar(client,this)
        }catch(erro){
            throw erro
        }
    }
    
    async consultarPontos(client,rotaCodigo){
        try{
            const dao = new Rotas_PontosDAO()
            return await dao.consultarPontos(client,rotaCodigo)
        }catch(erro){
            throw erro
        }
    }





}