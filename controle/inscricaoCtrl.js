import Inscricao from "../modelo/inscricao.js";
import poolConexao from "../persistencia/conexao.js";

export default class InscricaoCtrl {
    static _instance = null;

    constructor() {
        InscricaoCtrl._instance = this;
    }

    static getInstance() {
        if (InscricaoCtrl._instance == null)
            new InscricaoCtrl();
        return InscricaoCtrl._instance;
    }

    async gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const ano = dados.ano;
            const aluno = dados.aluno;
            const pontoEmbarque = dados.pontoEmbarque;
            const escola = dados.escola;
            const cep = dados.cep;
            const rua = dados.rua;
            const numero = dados.numero;
            const bairro = dados.bairro;
            const periodo = dados.periodo;
            const etapa = dados.etapa;
            const anoLetivo = dados.anoLetivo;
            const turma = dados.turma;
            if (ano >= 0 && aluno && pontoEmbarque && escola && cep && rua && numero && bairro && periodo && etapa && anoLetivo && turma) {
                const client = await poolConexao.getInstance().connect();
                try {
                    await client.query('BEGIN');
                    const inscricao = new Inscricao(ano, aluno, pontoEmbarque, escola, null, cep, rua, numero, bairro, periodo, etapa, anoLetivo, turma, '');
                    inscricao.gravar(client).then(async () => {
                        resposta.status(200).json({
                            "status": true,
                            "mensagem": 'Inscrição incluida com sucesso!'
                        });
                        await client.query('COMMIT');
                    }).catch(async (erro) => {
                        if (erro.code === '23503') {
                            resposta.status(400).json({
                                "status": false,
                                "mensagem": 'Inscrição não pode ser excluída pois está sendo usada.'
                            });
                        }
                        else {
                            resposta.status(500).json({
                                "status": false,
                                "mensagem": 'Erro ao excluir inscrição  : ' + erro.message
                            });
                        }
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
                    "mensagem": 'Por favor, informe o nome da inscrição!'
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método POST para cadastrar uma inscrição!'
            });
        }
    }

    async atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const ano = dados.ano;
            const aluno = dados.aluno;
            const pontoEmbarque = dados.pontoEmbarque;
            const escola = dados.escola;
            const cep = dados.cep;
            const rua = dados.rua;
            const numero = dados.numero;
            const bairro = dados.bairro;
            const periodo = dados.periodo;
            const etapa = dados.etapa;
            const anoLetivo = dados.anoLetivo;
            const turma = dados.turma;
            if (ano >= 0 && aluno && pontoEmbarque && escola && cep && rua && numero && bairro && periodo && etapa && anoLetivo && turma) {
                const client = await poolConexao.getInstance().connect();
                try {
                    await client.query('BEGIN');
                    const inscricao = new Inscricao(ano, aluno, pontoEmbarque, escola, null, cep, rua, numero, bairro, periodo, etapa, anoLetivo, turma, '');
                    inscricao.atualizar(client).then(async () => {
                        resposta.status(200).json({
                            "status": true,
                            "mensagem": 'Inscrição alterada com sucesso!'
                        });
                        await client.query('COMMIT');
                    }).catch(async (erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": 'Erro ao alterar a inscrição: ' + erro.message
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
                    "mensagem": 'Por favor, informe o codigo e o nome da inscrição!'
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize os métodos PUT ou PATCH para atualizar uma inscrição!'
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const ano = dados.ano;
            const aluno = dados.aluno;
            if (aluno.codigo >= 0 && ano >= 0) {
                const client = await poolConexao.getInstance().connect();
                try {
                    await client.query('BEGIN');
                    const inscricao = new Inscricao(ano, aluno);
                    inscricao.excluir(client).then(async () => {
                        resposta.status(200).json({
                            "status": true,
                            "mensagem": 'Inscrição excluída com sucesso!'
                        });
                        await client.query('COMMIT');
                    }).catch(async (erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": 'Erro ao excluir a inscrição: ' + erro.message
                        });
                        await client.query('ROLLBACK');
                    });
                }
                catch (e) {
                    await client.query('ROLLBACK');
                    throw e;
                }
                finally {
                    client.release();
                }
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Por favor, informe o codigo da inscrição!'
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize os métodos DELETE para excluir uma inscrição!'
            });
        }
    }

    async consultar(requisicao, resposta) {
        resposta.type('application/json');
        let termo = requisicao.params.termo;
        if (requisicao.method === 'GET') {
            const client = await poolConexao.getInstance().connect();
            const inscricoes = new Inscricao();
            inscricoes.consultar(client, termo).then((listaInscricoes) => {
                resposta.json({
                    "status": true,
                    "listaInscricoes": listaInscricoes
                });
            }).catch((erro) => {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": 'Erro ao consultar as inscrições: ' + erro.message
                });
            });
            client.release();
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método GET para consultar as inscrições!'
            });
        }
    }

    async consultarFora(requisicao, resposta) {
        resposta.type('application/json');
        let termo = requisicao.params.termo;
        if (!termo) {
            termo = '';
        }
        if (requisicao.method === 'GET') {
            const client = await poolConexao.getInstance().connect();
            const inscricoes = new Inscricao();
            inscricoes.consultarFora(client, termo).then((listaInscricoes) => {
                resposta.json({
                    "status": true,
                    "listaInscricoes": listaInscricoes
                });
            }).catch((erro) => {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": 'Erro ao consultar as inscrições: ' + erro.message
                });
            });
            client.release();
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método GET para consultar as inscrições!'
            });
        }
    }
}