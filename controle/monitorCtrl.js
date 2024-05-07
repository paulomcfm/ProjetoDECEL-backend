import Monitor from "../modelo/monitor.js";
import poolConexao from "../persistencia/conexao.js";

export default class MonitorCtrl{
    static _instance = null;

    constructor() {
        MonitorCtrl._instance = this;
    }

    static getInstance() {
        if (MonitorCtrl._instance == null)
            new MonitorCtrl();
        return MonitorCtrl._instance;
    }

    async consultar(requisicao,resposta){
        try{
            let termo = requisicao.params.termo
            if(termo === undefined)
                termo = ''
            const client = await poolConexao.getInstance().connect()
            try{ 
                await client.query('BEGIN')     
                const lista = await new Monitor().consultar(client,termo)
                resposta.status(200).json({
                    status:true,
                    mensagem:"Monitores consultados com sucesso",
                    listaMonitores:lista
                })
            }catch(erro){
                await client.query('ROLLBACK')
                console.log(erro)
                resposta.status(500).json({
                    status:false,
                    mensagem:erro,
                    listaMonitores:[]
                })
            }finally{
                await client.release()
            }
        }catch(erro){
            resposta.status(500).json({
                status:false,
                mensagem:"Erro ao consultar monitores",
                listaMonitores:[]
            })
        }
    }

    async excluir(requisicao,resposta){
        try{
            let termo = requisicao.params.termo
            if(termo !== undefined){
                const client = await poolConexao.getInstance().connect()
                try{ 
                    await client.query('BEGIN')     
                    await new Monitor().excluir(client,termo)
                    await client.query('COMMIT')
                    resposta.status(200).json({
                        status:true,
                        mensagem:"Monitor excluido com sucesso"
                    })
                }catch(erro){
                    await client.query('ROLLBACK')
                    resposta.status(500).json({
                        status:false,
                        mensagem:erro
                    })
                }
                client.release()
            }else{
                resposta.status(500).json({
                    status:false,
                    mensagem:"Sem monitor selecionado para exclusão"
                })
            }
        }catch(erro){
            resposta.status(500).json({
                status:false,
                mensagem:"Erro ao excluir monitores"
            })
        }
    }

    async gravar(requisicao,resposta){
        const dados = requisicao.body
        try{
            const monitor = new Monitor(dados.codigo,dados.nome,dados.cpf,dados.celular)
            const client = await poolConexao.getInstance().connect()
            await client.query('BEGIN')
            try{
                await monitor.gravar(client)
                resposta.status(200).json({
                    status:true,
                    mensagem:"Monitor gravado com sucesso!!!"
                })
                await client.query('COMMIT')
            }catch(erro){
                await client.query('ROLLBACK')
                resposta.status(500).json({
                    status:false,
                    mensagem:"Erro ao gravar monitor: "+erro
                })
            }

            await client.release()
        }catch(erro){
            resposta.status(500).json({
                status:false,
                mensagem:"Erro ao gravar monitor: "+erro
            })
        }
    }


    async atualizar(requisicao,resposta){
        const dados = requisicao.body
        try{
            const monitor = new Monitor(dados.codigo,dados.nome,dados.cpf,dados.celular)
            const client = await poolConexao.getInstance().connect()
            await client.query('BEGIN')
            try{
                await monitor.atualizar(client)
                resposta.status(200).json({
                    status:true,
                    mensagem:"Monitor atualizado com sucesso!!!"
                })
                await client.query('COMMIT')
            }catch(erro){
                await client.query('ROLLBACK')
                resposta.status(500).json({
                    status:false,
                    mensagem:"Erro ao atualizar monitor: "+erro
                })
            }

            await client.release()
        }catch(erro){
            resposta.status(500).json({
                status:false,
                mensagem:"Erro ao atualizar monitor: "+erro
            })
        }
    }





}