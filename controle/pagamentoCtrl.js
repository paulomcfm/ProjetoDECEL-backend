import Pagamento from "../modelo/pagamento.js";
import poolConexao from "../persistencia/conexao.js";
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
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const mes = dados.mes;
            const ano = dados.ano;
            const valorPagamento = dados.valorPagamento;
            const status = dados.status || 'P'; // Status padrão como 'Pendente'
            const tipo = dados.tipo;
            if (mes && ano && valorPagamento && tipo) {
                const pagamento = new Pagamento(0, mes, ano, valorPagamento, status, tipo);
                const client = await poolConexao.getInstance().connect();
                try {
                    await client.query('BEGIN');
                    await pagamento.gravar(client).then(() => {
                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Pagamento registrado com sucesso!",
                            "pagamento": pagamento
                        });
                        client.query('COMMIT');
                    }).catch(async (erro) => {
                        await client.query('ROLLBACK');
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao registrar o pagamento: " + erro.message
                        });
                    });
                } catch (erro) {
                    await client.query('ROLLBACK');
                    throw erro;
                } finally {
                    client.release();
                }
                this.gravarContaPagamento();
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, preencha todos os campos obrigatórios!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método POST e envie os dados no formato JSON!"
            });
        }
    }

    gravarContaPagamento() {
        // Abre conexão com o banco, se necessário
        console.log("Conexão com o banco aberta para Pagamento.");
        this.gravarConta(); // Chama o método da classe base
    }

    atualizaCaixa() {
        // Implementação específica para pagamentos
        console.log(`Atualizando o caixa: subtraindo ${this.valor}`);
        // Exemplo: atualiza o valor do caixa subtraindo o valor do pagamento
    }

    async atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            const mes = dados.mes;
            const ano = dados.ano;
            const valorPagamento = dados.valorPagamento;
            const status = dados.status;
            const tipo = dados.tipo;

            if (codigo && mes && ano && valorPagamento && tipo) {
                const pagamento = new Pagamento(codigo, mes, ano, valorPagamento, status, tipo);
                const client = await poolConexao.getInstance().connect();

                try {
                    await client.query('BEGIN');
                    await pagamento.atualizar(client).then(() => {
                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Pagamento atualizado com sucesso!",
                            "pagamento": pagamento
                        });
                        client.query('COMMIT');
                    }).catch(async (erro) => {
                        await client.query('ROLLBACK');
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao atualizar o pagamento: " + erro.message
                        });
                    });
                } catch (erro) {
                    await client.query('ROLLBACK');
                    throw erro;
                } finally {
                    client.release();
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, preencha todos os campos obrigatórios!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize os métodos PUT ou PATCH e envie os dados no formato JSON!"
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;

            if (codigo) {
                const client = await poolConexao.getInstance().connect();

                try {
                    await client.query('BEGIN');
                    const pagamento = new Pagamento(codigo);
                    await pagamento.excluir(client).then(() => {
                        resposta.status(200).json({
                            "status": true,
                            "mensagem": "Pagamento excluído com sucesso!"
                        });
                        client.query('COMMIT');
                    }).catch(async (erro) => {
                        await client.query('ROLLBACK');
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao excluir o pagamento: " + erro.message
                        });
                    });
                } catch (erro) {
                    await client.query('ROLLBACK');
                    throw erro;
                } finally {
                    client.release();
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código do pagamento!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método DELETE e envie os dados no formato JSON!"
            });
        }
    }

    async consultar(requisicao, resposta) {
        if (requisicao.method === 'GET') {
            const client = await poolConexao.getInstance().connect();
            const pagamento = new Pagamento();

            try {
                const listaPagamentos = await pagamento.consultar(client);
                resposta.json({
                    "status": true,
                    "listaPagamentos": listaPagamentos
                });
            } catch (erro) {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Erro ao consultar os pagamentos: " + erro.message
                });
            } finally {
                client.release();
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método GET para consultar os pagamentos!"
            });
        }
    }

    async consultarPorTipo(requisicao, resposta) {
        const { tipo } = requisicao.params;
        if (requisicao.method === 'GET' && tipo) {
            const client = await poolConexao.getInstance().connect();
            const pagamento = new Pagamento();

            try {
                const pagamentos = await pagamento.consultarPorTipo(tipo, client);
                if (pagamentos) {
                    resposta.json({
                        "status": true,
                        "pagamentos": pagamentos
                    });
                } else {
                    resposta.status(404).json({
                        "status": false,
                        "mensagem": "Pagamentos não encontrados!"
                    });
                }
            } catch (erro) {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": "Erro ao consultar os pagamentos: " + erro.message
                });
            } finally {
                client.release();
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método GET e informe o tipo de pagamento!"
            });
        }
    }
}