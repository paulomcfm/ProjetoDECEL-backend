import Recebimento from "../modelo/recebimento.js";
import poolConexao from "../persistencia/conexao.js";

export default class RecebimentoCtrl {
    static _instance = null;

    constructor() {
        RecebimentoCtrl._instance = this;
    }

    static getInstance() {
        if (RecebimentoCtrl._instance == null)
            new RecebimentoCtrl();
        return RecebimentoCtrl._instance;
    }
    async gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST') {
            const dados = requisicao.body;
            const tipo = dados.tipo;
            const valorMensalidade = dados.valorMensalidade;
            const status = 'N';
            const aluno = dados.aluno;
            const mes = dados.mes;
            const ano = dados.ano;
            const qtdParcelas = dados.qtdParcelas;
            const recebimento = new Recebimento(0, tipo, valorMensalidade, status, aluno, mes, ano, qtdParcelas);
            if (aluno && mes && ano && valorMensalidade && tipo && qtdParcelas) {
                const client = await poolConexao.getInstance().connect();
                try {
                    await client.query('BEGIN');
                    recebimento.calcularValor();
                    if (recebimento.qtdParcelas == 1) {
                        await recebimento.gravar(client);
                    }
                    else {
                        let qtdParc = recebimento.qtdParcelas;
                        let mesAux = mes;
                        let anoAux = ano;
                        for (let i = 1; i <= qtdParc; i++) {
                            mesAux += 1;
                            if (mesAux > 12) {
                                mesAux = 1;
                                anoAux++;
                            }
                            recebimento.mes = mesAux;
                            recebimento.ano = anoAux; 
                            await recebimento.gravar(client);
                        }
                    }
                    await client.query('COMMIT');
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": recebimento.codigo,
                        "mensagem": 'Recebimento incluido com sucesso!'
                    });
                } catch (e) {
                    await client.query('ROLLBACK');
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": 'Erro ao atualizar o recebimento: ' + e.message
                    });
                } finally {
                    await client.release();
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Por favor, informe o aluno do recebimento!'
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método POST para cadastrar um recebimento!'
            });
        }
    }
}