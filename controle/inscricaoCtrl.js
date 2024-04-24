import Inscricao from "../modelo/inscricao.js";
import poolConexao from "../persistencia/conexao.js";

export default class InscricaoCtrl {

    static _instance = null;

    constructor() {
        if (InscricaoCtrl._instance) {
            return InscricaoCtrl._instance
        }
        InscricaoCtrl._instance = this;
    }

    static async gravar(requisicao, resposta) {
        var ok = true;
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const data = new Date();
            const ano = data.getFullYear();
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
                const client = await poolConexao.connect();
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
                        await client.query('ROLLBACK');
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": 'Erro ao registrar a inscrição: ' + erro.message
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

    static async atualizar(requisicao, resposta) {
        var ok = true;
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
                const client = await poolConexao.connect();
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

    static async atualizarInscricoes(requisicao, resposta) {
        var ok = true;
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            if (dados.length > 0) {
                const client = await poolConexao.connect();
                try {
                    await client.query('BEGIN');
                    const inscricao = new Inscricao();
                    inscricao.consultarPorRota(client, dados[0].rota).then(async (inscricoes) => {
                        for (const inscricaoEncontrada of inscricoes) {
                            const encontradaEmDados = dados.find(d => d.aluno.codigo === inscricaoEncontrada.aluno.codigo);
                            if (!encontradaEmDados) {
                                inscricaoEncontrada.rota = null;
                                inscricaoEncontrada.dataAlocacao = null;
                                inscricaoEncontrada.atualizarRota(client).catch((erro) => {
                                    ok = false;
                                    resposta.status(500).json({
                                        "status": false,
                                        "mensagem": 'Erro ao atualizar a inscrição: ' + erro.message
                                    });
                                });
                            }
                        }
                        if (ok) {
                            for (const inscricao of dados) {
                                const naoEncontradaNaConsulta = inscricoes.every(i => i.aluno.codigo !== inscricao.aluno.codigo);
                                if (naoEncontradaNaConsulta) {
                                    const novaInscricao = new Inscricao(
                                        inscricao.ano,
                                        inscricao.aluno,
                                        inscricao.pontoEmbarque,
                                        inscricao.escola,
                                        inscricao.rota,
                                        inscricao.cep,
                                        inscricao.rua,
                                        inscricao.numero,
                                        inscricao.bairro,
                                        inscricao.periodo,
                                        inscricao.etapa,
                                        inscricao.anoLetivo,
                                        inscricao.turma,
                                        inscricao.dataAlocacao
                                    );
                                    novaInscricao.atualizarRota(client).catch((erro) => {
                                        ok = false;
                                        resposta.status(500).json({
                                            "status": false,
                                            "mensagem": 'Erro ao atualizar a inscrição: ' + erro.message
                                        });
                                    });
                                }
                            }
                            if (ok) {
                                resposta.status(200).json({
                                    "status": true,
                                    "mensagem": 'Inscrições alteradas com sucesso!'
                                });
                                await client.query('COMMIT');
                            }
                            else {
                                await client.query('ROLLBACK');
                            }
                        }
                        else {
                            await client.query('ROLLBACK');
                        }
                    }).catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": 'Erro ao alterar as inscrições: ' + erro.message
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
                    "mensagem": 'Por favor, informe inscrições!'
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

    static async excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const ano = dados.ano;
            const aluno = dados.aluno;
            if (aluno.codigo >= 0 && ano >= 0) {
                const client = await poolConexao.connect();
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

    static async consultar(requisicao, resposta) {
        resposta.type('application/json');
        let termo = requisicao.params.termo;
        if (!termo) {
            termo = '';
        }
        if (requisicao.method === 'GET') {
            const client = await poolConexao.connect();
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
}