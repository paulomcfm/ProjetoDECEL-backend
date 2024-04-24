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
            console.log(dados)
            const nome = dados.nome
            const km = dados.km
            const periodo = dados.periodo
            const ida = dados.ida
            const volta = dados.volta
            const veiculo = dados.veiculo
            const monitor = dados.monitor
            const motoristas = JSON.parse(dados.motoristas)
            const pontos = JSON.parse(dados.pontos)
            const rota = new defRota(0,nome,km,periodo,ida,volta,veiculo,monitor,pontos,monitor)
            const client = await poolConexao.connect();            

            // se continua ou da rollback
            let flag = true;
            try{
                await client.query('BEGIN');
                rota.gravar(client).then(()=>{
                    resposta.status(200).json({
                        status:true,
                        mensagem:"Rota cadastrada com sucesso !!!"
                    })
                    console.log("codigo retornado: "+rota.codigo)
                    /// grava os pontos da rota
                    rota.gravarPontos(client).then(()=>{

                        // TERMINAR//
                        // fazer gravacao dos motoristas
                        client.query('COMMIT')
                        

                        // se ocorrer erro no meio da transacao ocorre rollback
                    }).catch(async (error)=>{
                        await client.query('ROLLBACK');
                    })
                }).catch((error)=>{
                    console.log(error)
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
                for(let i=0;i<listaRotas.length && flag;i++){
                    const registro = listaRotas[i]
                    registro.consultarPontos(client).then(()=>{
                        registro.consultarMotoristas(client).then(()=>{
                            listaRotas[i] = registro
                            if(i+1>=listaRotas.length){
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
}