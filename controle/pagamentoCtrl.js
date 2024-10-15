import Pagamento from "../modelo/pagamento.js";
import poolConexao from "../persistencia/conexao.js";
import Aluno from "../modelo/aluno.js";
import ContasCtrl from "./contasCtrl.js";

export default class PagamentoCtrl extends ContasCtrl{
    static _instance = null;

    constructor() {
        super();
        PagamentoCtrl._instance = this;
    }

    static getInstance() {
        if (PagamentoCtrl._instance == null)
            new PagamentoCtrl();
        return PagamentoCtrl._instance;
    }
    async gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST') {
            const dados = requisicao.body;
            const mes = dados.mes;
            const ano = dados.ano;
            const valorPagamento = dados.valorPagamento;
            const pagamento = new Pagamento(0, mes, ano, valorPagamento);
            if (mes && ano && valorPagamento) {
                const client = await poolConexao.getInstance().connect();
                try {
                    await client.query('BEGIN');
                    await pagamento.gravar(client);
                    PagamentoCtrl.getInstance().gravarConta(pagamento);
                    await client.query('COMMIT');
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": pagamento.codigo,
                        "mensagem": 'Pagamento incluido com sucesso!'
                    });
                } catch (e) {
                    await client.query('ROLLBACK');
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": 'Erro ao atualizar o pagamento: ' + e.message
                    });
                } finally {
                    await client.release();
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Por favor, informe o aluno do pagamento!'
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método POST para cadastrar um pagamento!'
            });
        }
    }

    atualizaCaixa(pagamento) {
        console.log(`Atualizando o caixa: removendo ${pagamento.valorPagamento} R$`);
    }
}