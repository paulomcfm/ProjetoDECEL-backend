import Aluno from "../modelo/aluno.js";
import Parentesco from "../modelo/parentesco.js";
import poolConexao from "../persistencia/conexao.js";

export default class AlunoCtrl {
    static _instance = null;

    constructor() {
        AlunoCtrl._instance = this;
    }

    static getInstance() {
        if (AlunoCtrl._instance == null)
            new AlunoCtrl();
        return AlunoCtrl._instance;
    }
    async gravar(requisicao, resposta) {
        var ok = true;
        resposta.type('application/json');
        if (requisicao.method === 'POST') {
            const dados = requisicao.body;
            const nome = dados.nome;
            const rg = dados.rg;
            const observacoes = dados.observacoes;
            const dataNasc = dados.dataNasc;
            const celular = dados.celular;
            const responsaveis = dados.responsaveis;
            const aluno = new Aluno(0, nome, rg, observacoes, dataNasc, celular, responsaveis);
            if (nome && rg && aluno.validarDataNascimento(dataNasc)) {
                const client = await poolConexao.connect();
                try {
                    await client.query('BEGIN');
                    aluno.gravar(client).then(async () => {
                        for (const responsavel of aluno.responsaveis) {
                            const parentesco = new Parentesco(aluno.codigo, responsavel.codigo, responsavel.parentesco);
                            await parentesco.gravar(client).catch((err) => {
                                ok = false;
                                resposta.status(500).json({
                                    "status": false,
                                    "mensagem": 'Erro ao registrar o aluno: ' + err.message
                                });
                            })
                        }
                        if (ok) {
                            resposta.status(200).json({
                                "status": true,
                                "codigoGerado": aluno.codigo,
                                "mensagem": 'Aluno incluido com sucesso!'
                            });
                            client.query('COMMIT');
                        }
                        else {
                            resposta.status(500).json({
                                "status": false,
                                "mensagem": 'Erro ao registrar o aluno.'
                            });
                            client.query('ROLLBACK');
                        }
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
                                "mensagem": 'Erro ao registrar o aluno: ' + erro.message
                            });
                        }
                    });
                } catch (e) {
                    await client.query('ROLLBACK');
                    throw e;
                } finally {
                    client.release();
                }
            } else if (!aluno.validarDataNascimento(dataNasc)) {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Data de nascimento inválida.'
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Por favor, informe o nome do aluno!'
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método POST para cadastrar um aluno!'
            });
        }
    }

    async atualizar(requisicao, resposta) {
        var ok = true;
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            const nome = dados.nome;
            const rg = dados.rg;
            const observacoes = dados.observacoes;
            const dataNasc = dados.dataNasc;
            const celular = dados.celular;
            const responsaveis = dados.responsaveis;
            const aluno = new Aluno(codigo, nome, rg, observacoes, dataNasc, celular, responsaveis);
            if (codigo >= 0 && nome && rg && aluno.validarDataNascimento(dataNasc)) {
                const client = await poolConexao.connect();
                try {
                    await client.query('BEGIN');

                    const parentescos = new Parentesco();
                    const res = await parentescos.consultarAluno(aluno.codigo, client);

                    const responsaveisFaltantes = res.filter(responsavel => {
                        return !aluno.responsaveis.some(alunoResponsavel => alunoResponsavel.codigo === responsavel.codigoResponsavel);
                    });

                    for (const responsavel of responsaveisFaltantes) {
                        const par = new Parentesco(aluno.codigo, responsavel.codigoResponsavel, responsavel.parentesco);
                        try {
                            await par.excluir(client);
                        } catch (err) {
                            ok = false;
                            resposta.status(500).json({
                                "status": false,
                                "mensagem": 'Erro ao atualizar o aluno: ' + err.message
                            });
                        }
                    }

                    const responsaveisNovos = aluno.responsaveis.filter(responsavel => {
                        return !res.some(parentesco => parentesco.codigoResponsavel === responsavel.codigo);
                    });

                    if (ok) {
                        for (const responsavel of responsaveisNovos) {
                            const par = new Parentesco(aluno.codigo, responsavel.codigo, responsavel.parentesco);
                            try {
                                await par.gravar(client);
                            } catch (err) {
                                ok = false;
                                resposta.status(500).json({
                                    "status": false,
                                    "mensagem": 'Erro ao atualizar o aluno: ' + err.message
                                });
                            }
                        }
                    }

                    const parentescosAtuais = res.filter(responsavel => {
                        return aluno.responsaveis.some(alunoResponsavel => alunoResponsavel.codigo === responsavel.codigoResponsavel);
                    });

                    if (ok) {
                        for (const responsavel of parentescosAtuais) {
                            const responsavelAtualizado = aluno.responsaveis.find(alunoResponsavel => alunoResponsavel.codigo === responsavel.codigoResponsavel);
                            if (responsavel.parentesco !== responsavelAtualizado.parentesco) {
                                const par = new Parentesco(aluno.codigo, responsavel.codigoResponsavel, responsavelAtualizado.parentesco);
                                try {
                                    await par.atualizar(client);
                                } catch (err) {
                                    ok = false;
                                    resposta.status(500).json({
                                        "status": false,
                                        "mensagem": 'Erro ao atualizar o aluno: ' + err.message
                                    });
                                }
                            }
                        }
                    }
                    if (ok) {
                        await aluno.atualizar(client).then(async () => {
                            resposta.status(200).json({
                                "status": true,
                                "codigoGerado": aluno.codigo,
                                "mensagem": 'Aluno alterado com sucesso!'
                            });
                            await client.query('COMMIT');
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
                                    "mensagem": 'Erro ao atualizar o aluno: ' + erro.message
                                });
                            }
                        });
                    }
                    else {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": 'Erro ao atualizar o aluno.'
                        });
                        client.query('ROLLBACK');
                    }
                } catch (e) {
                    await client.query('ROLLBACK');
                    throw e;
                } finally {
                    client.release();
                }
            }
            else if (!aluno.validarDataNascimento(dataNasc)) {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Data de nascimento inválida.'
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Por favor, informe o código e o nome do aluno!'
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize os métodos PUT ou PATCH para atualizar um aluno!'
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            if (codigo >= 0) {
                const client = await poolConexao.connect();
                try {
                    await client.query('BEGIN');
                    const aluno = new Aluno(codigo);
                    aluno.excluir(client).then(async () => {
                        resposta.status(200).json({
                            "status": true,
                            "codigoGerado": aluno.codigo,
                            "mensagem": 'Aluno excluído com sucesso!'
                        });
                        await client.query('COMMIT');
                    }).catch(async (erro) => {
                        if (erro.code === '23503') {
                            resposta.status(400).json({
                                "status": false,
                                "mensagem": 'Aluno não pode ser excluído pois está inscrito.'
                            });
                        }
                        else {
                            resposta.status(500).json({
                                "status": false,
                                "mensagem": 'Erro ao excluir o aluno: ' + erro.message
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
                    "mensagem": 'Por favor, informe o codigo do aluno!'
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize os métodos DELETE para excluir um aluno!'
            });
        }
    }

    async consultar(requisicao, resposta) {
        let termo = requisicao.params.termo;
        if (!termo) {
            termo = '';
        }
        if (requisicao.method === 'GET') {
            const client = await poolConexao.connect();
            const alunos = new Aluno();
            alunos.consultar(termo, client).then((listaAlunos) => {
                resposta.json({
                    "status": true,
                    "listaAlunos": listaAlunos
                });
            }).catch((erro) => {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": 'Erro ao consultar os alunos: ' + erro.message
                });
            });
            client.release();
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método GET para consultar os alunos!'
            });
        }
    }
}