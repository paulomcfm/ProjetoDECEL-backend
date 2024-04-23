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
            const monitor = dados.monitor
            const motoristas = dados.motoristas
            const pontos = dados.pontos
            const rota = new defRota(0,nome,km,periodo,ida,volta,veiculo,monitor)
            const client = await poolConexao.connect();            
            try{
                await client.query('BEGIN');
                rota.gravar(client).then(()=>{
                    resposta.status(200).json({
                        status:true,
                        mensagem:"Rota cadastrada com sucesso !!!"
                    })
                    console.log(rota.rot_codigo)
                    client.query('COMMIT')
                }).catch((error)=>{
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