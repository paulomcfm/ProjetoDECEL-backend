import Aluno from "../modelo/aluno.js";
import Parentesco from "../modelo/parentesco.js";
import poolConexao from "../persistencia/conexao.js";
import ParentescoCtrl from "./parentescoCtrl.js";

export default class AlunoCtrl {
    static _instance = null;

    constructor() {
        if (AlunoCtrl._instance) {
            return AlunoCtrl._instance
        }
        AlunoCtrl._instance = this;
    }
    static async gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST') {
            const dados = requisicao.body;
            const nome = dados.nome;
            const rg = dados.rg;
            const observacoes = dados.observacoes;
            const dataNasc = dados.dataNasc;
            const celular = dados.celular;
            const aluno = new Aluno(0, nome, rg, observacoes, dataNasc, celular);
            if (nome && rg && aluno.validarDataNascimento(dataNasc)) {
                const client = await poolConexao.connect();
                try {
                    await client.query('BEGIN');
                    aluno.gravar(client).then(() => {
                        resposta.status(200).json({
                            "status": true,
                            "codigoGerado": aluno.codigo,
                            "mensagem": 'Aluno incluido com sucesso!'
                        });
                        ParentescoCtrl.gravar(requisicao, resposta);
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

    static async atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            const nome = dados.nome;
            const rg = dados.rg;
            const observacoes = dados.observacoes;
            const dataNasc = dados.dataNasc;
            const celular = dados.celular;
            const aluno = new Aluno(codigo, nome, rg, observacoes, dataNasc, celular);
            // const parentescosAtuais = dados.responsaveis.map(responsavel => {
            //     return new Parentesco(codigo, responsavel.codigoResponsavel, responsavel.parentesco);
            // });
            if (codigo >= 0 && nome && rg && aluno.validarDataNascimento(dataNasc)) {
                const client = await poolConexao.connect();
                try {
                    await client.query('BEGIN');
                    aluno.atualizar(client).then(() => {
                        resposta.status(200).json({
                            "status": true,
                            "codigoGerado": aluno.codigo,
                            "mensagem": 'Aluno alterado com sucesso!'
                        });
                        // const parentescosAntes = ParentescoCtrl.consultarAluno(codigo);
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
                                "mensagem": 'Erro ao alterar o aluno: ' + erro.message
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

    static async excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            if (codigo >= 0) {
                const client = await poolConexao.connect();
                try {
                    await client.query('BEGIN');
                    const aluno = new Aluno(codigo);
                    aluno.excluir(client).then(() => {
                        resposta.status(200).json({
                            "status": true,
                            "codigoGerado": aluno.codigo,
                            "mensagem": 'Aluno excluído com sucesso!'
                        });
                        client.query('COMMIT');
                    }).catch(async (erro) => {
                        await client.query('ROLLBACK');
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": 'Erro ao excluir o aluno: ' + erro.message
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

    static async consultar(requisicao, resposta) {
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
            }).catch(async (erro) => {
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