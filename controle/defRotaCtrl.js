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
            }catch(e){
                
            }         
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método POST para cadastrar um aluno!'
            });
        }
    }
}