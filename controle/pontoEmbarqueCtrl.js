import PontoEmbarque from "../modelo/pontoEmbarque.js";
import poolConexao from "../persistencia/conexao.js";

export default class PontoEmbarqueCtrl {
    static _instance = null;

    constructor() {
        PontoEmbarqueCtrl._instance = this;
    }

    static getInstance() {
        if (PontoEmbarqueCtrl._instance == null)
            new PontoEmbarqueCtrl();
        return PontoEmbarqueCtrl._instance;
    }

    async gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const rua = dados.rua;
            const numero = dados.numero;
            const bairro = dados.bairro;
            const cep = dados.cep;
            if (rua && numero && bairro && cep) {
                const pontoEmbarque = new PontoEmbarque(0, rua, numero, bairro, cep);
                const client = await poolConexao.getInstance().connect();
                try {
                    await client.query('BEGIN');
                    pontoEmbarque.gravar(client).then(async () => {
                        resposta.status(200).json({
                            "status": true,
                            "codigoGerado": pontoEmbarque.codigo,
                            "mensagem": 'Ponto de embarque incluido com sucesso!'
                        });
                        await client.query('COMMIT');
                    }).catch(async (erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": 'Erro ao registrar o ponto de embarque: ' + erro.message
                        });
                        await client.query('ROLLBACK');
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
                    "mensagem": 'Por favor, informe todos os dados de ponto de embarque!'
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método POST para cadastrar um ponto de embarque!'
            });
        }
    }

    async atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            const rua = dados.rua;
            const numero = dados.numero;
            const bairro = dados.bairro;
            const cep = dados.cep;
            if (codigo >= 0 && rua && numero && bairro && cep) {
                const pontoEmbarque = new PontoEmbarque(codigo, rua, numero, bairro, cep);
                const client = await poolConexao.getInstance().connect();
                try {
                    await client.query('BEGIN');
                    pontoEmbarque.atualizar(client).then(async () => {
                        resposta.status(200).json({
                            "status": true,
                            "codigoGerado": pontoEmbarque.codigo,
                            "mensagem": 'Ponto de embarque alterado com sucesso!'
                        });
                        await client.query('COMMIT');
                    }).catch(async (erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": 'Erro ao alterar o ponto de embarque: ' + erro.message
                        });
                        await client.query('ROLLBACK');
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
                    "mensagem": 'Por favor, informe o codigo e o endereço do ponto de embarque!'
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize os métodos PUT ou PATCH para atualizar um ponto de embarque!'
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            if (codigo >= 0) {
                const pontoEmbarque = new PontoEmbarque(codigo);
                const client = await poolConexao.getInstance().connect();
                try {
                    await client.query('BEGIN');
                    pontoEmbarque.excluir(client).then(async () => {
                        resposta.status(200).json({
                            "status": true,
                            "codigoGerado": pontoEmbarque.codigo,
                            "mensagem": 'Ponto de embarque excluído com sucesso!'
                        });
                        await client.query('COMMIT');
                    }).catch(async (erro) => {
                        if (erro.code === '23503') {
                            resposta.status(400).json({
                                "status": false,
                                "mensagem": 'Ponto de embarque não pode ser excluído pois está sendo usado.'
                            });
                        }
                        else {
                            resposta.status(500).json({
                                "status": false,
                                "mensagem": 'Erro ao excluir ponto de embarque: ' + erro.message
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
                    "mensagem": 'Por favor, informe o codigo do ponto de embarque!'
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize os métodos DELETE para excluir um ponto de embarque!'
            });
        }
    }

    async consultar(requisicao, resposta) {
        resposta.type('application/json');
        let termo = requisicao.params.termo;
        if (!termo) {
            termo = '';
        }
        if (requisicao.method === 'GET') {
            const client = await poolConexao.getInstance().connect();
            const pontosEmbarque = new PontoEmbarque();
            pontosEmbarque.consultar(client, termo).then((listaPontosEmbarque) => {
                resposta.json({
                    "status": true,
                    "listaPontosEmbarque": listaPontosEmbarque
                });
            }).catch((erro) => {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": 'Erro ao consultar os pontos de embarque: ' + erro.message
                });
            });
            client.release();
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método GET para consultar os pontos de embarque!'
            });
        }
    }
}