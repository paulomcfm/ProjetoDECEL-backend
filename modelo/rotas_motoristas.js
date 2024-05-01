import Rotas_MotoristasDAO from "../persistencia/rotas_motoristasDAO.js"

export default class Rotas_Motoristas{

    #rota
    #motoristas


    constructor(rota,motoristas){
        this.#rota = rota
        this.#motoristas = motoristas
    }

    get rota(){
        return this.#rota
    }

    set rota(novaRota){
        this.#rota = novaRota
    }

    
    get motoristas(){
        return this.#motoristas
    }

    set motoristas(novosMotoristas){
        this.#motoristas = novosMotoristas
    }


    async gravar(client){
        try{
            const dao = new Rotas_MotoristasDAO()
            await dao.gravar(client,this)
        }catch(erro){
            throw erro
        }
    }
    async atualizar(client){
        const dao = new Rotas_MotoristasDAO()
        await dao.atualizar(client)
    }
    async deletar(client){
        const dao = new Rotas_MotoristasDAO()
        await dao.deletar(client)
    }
    async consultar(client,rotaCodigo){
        try{
            const dao = new Rotas_MotoristasDAO()
            return await dao.consultar(client,rotaCodigo)
        }catch(erro){
            throw erro
        }
        
    }

    




}