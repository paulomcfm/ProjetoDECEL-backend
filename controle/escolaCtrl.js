import Escola from "../modelo/escola.js";
import poolConexao from "../persistencia/conexao.js";

export default class EscolaCtrl {
    static _instance = null;

    constructor() {
        EscolaCtrl._instance = this;
    }

    static getInstance() {
        if (EscolaCtrl._instance == null)
            new EscolaCtrl();
        return EscolaCtrl._instance;
    }

    async gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const nome = dados.nome;
            const tipo = dados.tipo;
            const email = dados.email;
            const telefone = dados.telefone;
            const pontoEmbarque = dados.pontoEmbarque;
            if (nome && tipo && email && telefone && pontoEmbarque) {
                const escola = new Escola(0, nome, tipo, email, telefone, pontoEmbarque);
                const client = await poolConexao.connect();
                try {
                    await client.query('BEGIN');
                    escola.gravar(client).then(async () => {
                        resposta.status(200).json({
                            "status": true,
                            "codigoGerado": escola.codigo,
                            "mensagem": 'Escola incluida com sucesso!'
                        });
                        await client.query('COMMIT');
                    }).catch(async (erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": 'Erro ao registrar a escola: ' + erro.message
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
                    "mensagem": 'Por favor, informe o nome da escola!'
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método POST para cadastrar uma escola!'
            });
        }
    }

    async atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            const nome = dados.nome;
            const tipo = dados.tipo;
            const email = dados.email;
            const telefone = dados.telefone;
            const pontoEmbarque = dados.pontoEmbarque;
            if (codigo >= 0 && nome && tipo && email && telefone && pontoEmbarque) {
                const escola = new Escola(codigo, nome, tipo, email, telefone, pontoEmbarque);
                const client = await poolConexao.connect();
                try {
                    await client.query('BEGIN');
                    escola.atualizar(client).then(async () => {
                        resposta.status(200).json({
                            "status": true,
                            "codigoGerado": escola.codigo,
                            "mensagem": 'Escola alterada com sucesso!'
                        });
                        await client.query('COMMIT');
                    }).catch(async (erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": 'Erro ao alterar a escola: ' + erro.message
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
                    "mensagem": 'Por favor, informe o codigo e o nome da escola!'
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize os métodos PUT ou PATCH para atualizar uma escola!'
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            if (codigo >= 0) {
                const escola = new Escola(codigo);
                const client = await poolConexao.connect();
                try {
                    await client.query('BEGIN');
                    escola.excluir(client).then(async () => {
                        resposta.status(200).json({
                            "status": true,
                            "codigoGerado": escola.codigo,
                            "mensagem": 'Escola excluída com sucesso!'
                        });
                        await client.query('COMMIT');
                    }).catch(async (erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": 'Erro ao excluir a escola: ' + erro.message
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
                    "mensagem": 'Por favor, informe o codigo da escola!'
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize os métodos DELETE para excluir uma escola!'
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
            const client = await poolConexao.connect();
            const escolas = new Escola();
            escolas.consultar(client, termo).then((listaEscolas) => {
                resposta.json({
                    "status": true,
                    "listaEscolas": listaEscolas
                });
            }).catch((erro) => {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": 'Erro ao consultar as escolas: ' + erro.message
                });
            });
            client.release();
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método GET para consultar as escolas!'
            });
        }
    }
}