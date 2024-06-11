import Veiculo from "../modelo/veiculo.js";
import poolConexao from "../persistencia/conexao.js";

export default class VeiculoCtrl {
    static _instance = null;

    constructor() {
        VeiculoCtrl._instance = this;
    }

    static getInstance() {
        if (VeiculoCtrl._instance == null)
            new VeiculoCtrl();
        return VeiculoCtrl._instance;
    }

    async gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST') {
            const dados = requisicao.body;
            const renavam = dados.renavam;
            const placa = dados.placa;
            const modelo = dados.modelo;
            const capacidade = dados.capacidade;
            const tipo = dados.tipo;
            const veiculo = new Veiculo(0, renavam, placa, modelo, capacidade, tipo);
            if (renavam && placa && modelo && capacidade && tipo) {
                const client = await poolConexao.getInstance().connect();
                try {
                    await client.query('BEGIN');
                    veiculo.gravar(client).then(() => {
                        resposta.status(200).json({
                            "status": true,
                            "codigoGerado": veiculo.codigo,
                            "mensagem": 'Veiculo incluido com sucesso!'
                        });
                        client.query('COMMIT');
                    }).catch(async (erro) => {
                        await client.query('ROLLBACK');
                        if (erro.code === '23505') {
                            resposta.status(400).json({
                                "status": false,
                                "mensagem": 'Renavam já cadastrado.'
                            });
                        } else {
                            resposta.status(500).json({
                                "status": false,
                                "mensagem": 'Erro ao registrar o veiculo: ' + erro.message
                            });
                        }
                    });
                } catch (e) {
                    await client.query('ROLLBACK');
                    throw e;
                } finally {
                    client.release();
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Por favor, informe o renavam do veiculo!'
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método POST para cadastrar um veiculo!'
            });
        }
    }

    async atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') || requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            const renavam = dados.renavam;
            const placa = dados.placa;
            const modelo = dados.modelo;
            const capacidade = dados.capacidade;
            const tipo = dados.tipo;
            const veiculo = new Veiculo(codigo, renavam, placa, modelo, capacidade, tipo);
            if (codigo >= 0 && renavam && placa && modelo && capacidade && tipo) {
                const client = await poolConexao.getInstance().connect();
                try {
                    await client.query('BEGIN');
                    veiculo.atualizar(client).then(() => {
                        resposta.status(200).json({
                            "status": true,
                            "codigoGerado": veiculo.codigo,
                            "mensagem": 'Veiculo alterado com sucesso!'
                        });
                        client.query('COMMIT');
                    }).catch(async (erro) => {
                        await client.query('ROLLBACK');
                        if (erro.code === '23505') {
                            resposta.status(400).json({
                                "status": false,
                                "mensagem": 'CPF já cadastrado.'
                            });
                        } else {
                            resposta.status(500).json({
                                "status": false,
                                "mensagem": 'Erro ao alterar o veiculo: ' + erro.message
                            });
                        }
                    });
                } catch (e) {
                    await client.query('ROLLBACK');
                    throw e;
                } finally {
                    client.release();
                }
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Por favor, informe o código!'
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize os métodos PUT ou PATCH para atualizar um veiculo!'
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type('application/json');       
        if (requisicao.method === 'DELETE' || requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            if (codigo >= 0) {
                const client = await poolConexao.getInstance().connect();
                try {
                    await client.query('BEGIN');
                    const veiculo = new Veiculo(codigo);
                    veiculo.excluir(client).then(() => {
                        resposta.status(200).json({
                            "status": true,
                            "codigoGerado": veiculo.codigo,
                            "mensagem": 'Veiculo excluído com sucesso!'
                        });
                        client.query('COMMIT');
                    }).catch(async (erro) => {
                        await client.query('ROLLBACK');
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": 'Erro ao excluir o veiculo: ' + erro.message
                        });
                    });
                } catch (e) {
                    await client.query('ROLLBACK');
                    throw e;
                } finally {
                    client.release();
                }
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Por favor, informe o codigo do veiculo!'
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize os métodos DELETE para excluir um veiculo!'
            });
        }
    }

    async consultar(requisicao, resposta) {
        let termo = requisicao.params.termo;
        if (!termo) {
            termo = '';
        }
        if (requisicao.method === 'GET') {
            const client = await poolConexao.getInstance().connect();
            const veiculos = new Veiculo();
            veiculos.consultar(termo, client).then((listaVeiculos) => {
                resposta.json({
                    "status": true,
                    "listaVeiculos": listaVeiculos
                });
                client.query('COMMIT');
            }).catch(async (erro) => {
                await client.query('ROLLBACK');
                resposta.status(500).json({
                    "status": false,
                    "mensagem": 'Erro ao consultar os veiculos: ' + erro.message
                });
            });
            client.release();
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método GET para consultar os veiculos!'
            });
        }
    }

    async consultarRota(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'GET') {
            const veiCodigo = requisicao.params.termo;
            console.log(requisicao.params.termo);
            console.log(veiCodigo);
            if (!veiCodigo || isNaN(veiCodigo)) {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Por favor, informe um código de veículo válido!'
                });
            }
            const client = await poolConexao.getInstance().connect();
            const veiculo = new Veiculo();
            try {
                const statusRota = await veiculo.consultarRota(veiCodigo, client);
                if (statusRota === null) {
                    resposta.status(404).json({
                        "status": false,
                        "mensagem": 'Veículo não encontrado em nenhuma rota!'
                    });
                } else {
                    resposta.status(200).json({
                        "status": true,
                        "rotaAtiva": statusRota
                    });
                }
                await client.query('COMMIT');
            } catch (erro) {
                await client.query('ROLLBACK');
                resposta.status(500).json({
                    "status": false,
                    "mensagem": 'Erro ao consultar a rota do veículo: ' + erro.message
                });
            } finally {
                client.release();
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método GET para consultar a rota do veículo!'
            });
        }
    }
}