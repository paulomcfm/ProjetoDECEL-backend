import poolConexao from "../persistencia/conexao.js";
import defRota from "../modelo/defRota.js";


export default class defRotaCtrl{
    static _instance = null;

    constructor() {
        if (AlunoCtrl._instance) {
            return AlunoCtrl._instance
        }
        AlunoCtrl._instance = this;
    }

    static async gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST') {
            const dados = requisicao.body;
            const nome = dados.nome
            const km = dados.km
            const periodo = dados.periodo
            const ida = dados.ida
            const volta = dados.volta
            const veiculo = dados.veiculo
            console.log("veiculo: "+veiculo)
            const monitor = dados.monitor
            const motoristas = JSON.parse(dados.motoristas)
            const pontos = JSON.parse(dados.pontos)
            const rota = new defRota(0,nome,km,periodo,ida,volta,veiculo,monitor,pontos,motoristas)
            const client = await poolConexao.connect();            

            // se continua ou da rollback
            let flag = true;
            try{
                await client.query('BEGIN');
                rota.gravar(client).then(()=>{
                
                    /// grava os pontos da rota
                    rota.gravarPontos(client).then(()=>{
                        // grava os motoristas
                        rota.gravarMotoristas(client).then(()=>{
                            // todos os dados foram gravados com sucesso
                            client.query('COMMIT')
                            resposta.status(200).json({
                                status:true,
                                mensagem:"Rota cadastrada com sucesso !!!"
                            })
                        }).catch(async (error)=>{
                            resposta.status(500).json({
                                status:false,
                                mensagem:"Erro ao cadastrar rota: "+error
                            })
                            await client.query('ROLLBACK');
                        })
                        
                        // se ocorrer erro no meio da transacao ocorre rollback
                    }).catch(async (error)=>{
                        resposta.status(500).json({
                            status:false,
                            mensagem:"Erro ao cadastrar rota: "+error
                        })
                        await client.query('ROLLBACK');
                    })
                }).catch((error)=>{
                    resposta.status(500).json({
                        status:false,
                        mensagem:"Erro ao cadastrar rota: "+error
                    })
                })
            }catch (e) {
                await client.query('ROLLBACK');
            } finally {
                client.release();
            }        
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método POST para cadastrar um aluno!'
            });
        }
    }

    static async consultar(requisicao,resposta){
        if(requisicao.method === 'GET'){
            let termo = requisicao.params.termo
            if(termo === undefined)
                termo = ""
            const rota = new defRota()
            const client = await poolConexao.connect()
            rota.consultar(client,termo).then((listaRotas)=>{
                let flag = true
                let num = 0
                for(let i=0;i<listaRotas.length && flag;i++){
                    const registro = listaRotas[i]
                    registro.consultarPontos(client).then(()=>{
                        registro.consultarMotoristas(client).then(()=>{
                            registro.consultarInscricoes(client).then(()=>{
                                num++;
                                if(num>=listaRotas.length){
                                    // resposta final com sucesso caso todos os registro foram consultados corretamente
                                    resposta.status(200).json({
                                        status:true,
                                        mensagem:"Rota consultada com sucesso",
                                        listaRotas:listaRotas
                                    })
                                }
                            }).catch((erro)=>{
                                flag = false
                                resposta.status(500).json({
                                    status:false,
                                    mensagem:'Não foi possivel consultar as rotas na base de dados: '+erro,
                                    listaRotas:[]
                                })
                            })
                        }).catch((erro)=>{
                            flag = false
                            resposta.status(500).json({
                                status:false,
                                mensagem:'Não foi possivel consultar as rotas na base de dados: '+erro,
                                listaRotas:[]
                            })
                        })
                    }).catch((erro)=>{
                        flag = false
                        resposta.status(500).json({
                            status:false,
                            mensagem:'Não foi possivel consultar as rotas na base de dados: '+erro,
                            listaRotas:[]
                        })
                    })

                    
                }
                if(!flag){
                    resposta.status(500).json({
                        status:false,
                        mensagem:'Erro ao consultar os pontos e motoristas da rota: ',
                        listaRotas:[]
                    })
                }

                // console.log(JSON.stringify(listaRotas))
            }).catch((erro)=>{
                resposta.status(500).json({
                    status:false,
                    mensagem:'Não foi possivel consultar as rotas na base de dados: '+erro,
                    listaRotas:[]
                })
            })
            client.release()
        }
        else{
            resposta.status(500).json({
                status:false,
                mensagem:'Utilize o método o GET para consultar os dados das rotas',
                listaRotas:[]
            })
        }
    } 

    static async atualizar(requisao,resposta){
        const dados = requisao.body
        const rota = new defRota(dados.codigo,dados.nome,dados.km,dados.periodo,dados.ida,dados.volta,dados.veiculo,dados.monitor,JSON.parse(dados.pontos),JSON.parse(dados.motoristas),[])
        
        try{
            const client = await poolConexao.connect()
            await client.query('BEGIN')
            await rota.atualizar(client).then(()=>{
                client.query('COMMIT')
                resposta.status(200).json({
                    status:true,
                    mensagem:"Rota atualizada com sucesso!!!"
                })
            }).catch(async (erro)=>{
                await client.query('ROLLBACK');
                resposta.status(500).json({
                    status:false,
                    mensagem:'Erro ao atualizar a rota: '+erro,
                })
            }).finally(()=>{
                client.release()
            })
        }catch(erro){
            resposta.status(500).json({
                status:false,
                mensagem:'Erro ao atualizar a rota: '+erro,
            })
        }
    }
}