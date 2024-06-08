import Manutencao from "../modelo/manutencao.js";
import ManutencaoDAO from "../persistencia/manutencaoDAO.js";
import poolConexao from "../persistencia/conexao.js";

export default class ManutencaoCtrl {
    static _instance = null;

    constructor() {
        ManutencaoCtrl._instance = this;
    }

    static getInstance() {
        if (ManutencaoCtrl._instance == null)
            new ManutencaoCtrl();
        return ManutencaoCtrl._instance;
    }

    async gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const { tipo, data, observacoes, id } = dados;
            if (tipo && data && id) {
                const manutencao = new Manutencao(tipo, data, observacoes, id);
                const client = await poolConexao.getInstance().connect();
                try {
                    await client.query('BEGIN');
                    await manutencao.gravar(client);
                    await client.query('COMMIT');
                    resposta.status(200).json({
                        "status": true,
                        "manutencao": manutencao,
                        "mensagem": 'Manutenção incluída com sucesso!'
                    });
                } catch (erro) {
                    await client.query('ROLLBACK');
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": 'Erro ao registrar a manutenção: ' + erro
                    });
                } finally {
                    client.release();
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Por favor, preencha todos os campos obrigatórios!'
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método POST e envie os dados no formato JSON para cadastrar uma manutenção!'
            });
        }
    }

    async atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const { codigo, tipo, data, observacoes, placa } = dados;
            if (codigo && tipo && data && placa) {
                const manutencao = new Manutencao(codigo, tipo, data, observacoes, placa);
                const client = await poolConexao.getInstance().connect();
                const manutencaoDAO = new ManutencaoDAO();
                try {
                    await client.query('BEGIN');
                    await manutencaoDAO.atualizar(manutencao, client);
                    await client.query('COMMIT');
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": 'Manutenção atualizada com sucesso!'
                    });
                } catch (erro) {
                    await client.query('ROLLBACK');
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": 'Erro ao atualizar a manutenção: ' + erro.message
                    });
                } finally {
                    client.release();
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Por favor, preencha todos os campos obrigatórios!'
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize os métodos PUT ou PATCH e envie os dados no formato JSON para atualizar uma manutenção!'
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const { codigo } = requisicao.body;
            if (codigo) {
                const client = await poolConexao.getInstance().connect();
                const manutencaoDAO = new ManutencaoDAO();
                try {
                    await client.query('BEGIN');
                    const manutencao = new Manutencao(codigo);
                    await manutencaoDAO.excluir(manutencao, client);
                    await client.query('COMMIT');
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": 'Manutenção excluída com sucesso!'
                    });
                } catch (erro) {
                    await client.query('ROLLBACK');
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": 'Erro ao excluir a manutenção: ' + erro.message
                    });
                } finally {
                    client.release();
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Por favor, informe o código da manutenção!'
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método DELETE e envie os dados no formato JSON para excluir uma manutenção!'
            });
        }
    }

    async consultar(requisicao, resposta) {
        if (requisicao.method === 'GET') {
            const client = await poolConexao.getInstance().connect();
            const manutencao = new Manutencao();
            try {
                const listaManutencoes = await manutencao.consultar(client);
                resposta.json({
                    "status": true,
                    "listaManutencoes": listaManutencoes
                });
            } catch (erro) {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": 'Erro ao consultar as manutenções: ' + erro.message
                });
            } finally {
                client.release();
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método GET para consultar as manutenções!'
            });
        }
    }

    async consultarPorPlaca(requisicao, resposta) {
        const { placa } = requisicao.params;
        if (requisicao.method === 'GET' && placa) {
            const client = await poolConexao.getInstance().connect();
            const manutencaoDAO = new ManutencaoDAO();
            try {
                const manutencao = await manutencaoDAO.consultarPorPlaca(placa, client);
                if (manutencao) {
                    resposta.json({
                        "status": true,
                        "manutencao": manutencao
                    });
                } else {
                    resposta.status(404).json({
                        "status": false,
                        "mensagem": 'Manutenção não encontrada!'
                    });
                }
            } catch (erro) {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": 'Erro ao consultar a manutenção: ' + erro.message
                });
            } finally {
                client.release();
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método GET e informe a placa do veículo para consultar a manutenção!'
            });
        }
    }

    async gravarPreventiva(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const { tipo, data, observacoes, placa } = dados;
            if (tipo && data && placa) {
                const manutencao = new Manutencao(null, tipo, data, observacoes, placa);
                const client = await poolConexao.getInstance().connect();
                const manutencaoDAO = new ManutencaoDAO();
                try {
                    await client.query('BEGIN');
                    await manutencaoDAO.gravar(manutencao, client);
                    await client.query('COMMIT');
                    resposta.status(200).json({
                        "status": true,
                        "manutencao": manutencao,
                        "mensagem": 'Manutenção preventiva incluída com sucesso!'
                    });
                } catch (erro) {
                    await client.query('ROLLBACK');
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": 'Erro ao registrar a manutenção preventiva: ' + erro.message
                    });
                } finally {
                    client.release();
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Por favor, preencha todos os campos obrigatórios!'
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método POST e envie os dados no formato JSON para cadastrar uma manutenção preventiva!'
            });
        }
    }
}