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




}