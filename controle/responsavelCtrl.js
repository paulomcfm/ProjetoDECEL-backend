import Responsavel from "../modelo/responsavel.js";
import Aluno from "../modelo/aluno.js";
import Parentesco from "../modelo/parentesco.js";
import poolConexao from "../persistencia/conexao.js";

export default class ResponsavelCtrl {
    static _instance = null;

    constructor()
    {
        ResponsavelCtrl._instance = this;
    }

    static getInstance()
    {
        if(ResponsavelCtrl._instance==null)
            new ResponsavelCtrl();
        return ResponsavelCtrl._instance;
    }
    async gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const nome = dados.nome;
            const rg = dados.rg;
            const cpf = dados.cpf;
            const email = dados.email;
            const telefone = dados.telefone;
            const celular = dados.celular;
            const alunos = dados.alunos;
            const responsavel = new Responsavel(0, nome, rg, cpf, email, telefone, celular, alunos); 
            if (nome && rg && cpf && email && telefone && celular) {
                const client = await poolConexao.getInstance().connect();
                try{
                    await client.query('BEGIN');
                    await responsavel.gravar(client);
                    for(const aluno of responsavel.alunos){
                        const alu = new Aluno(aluno.codigo);
                        const parentesco = new Parentesco(alu.codigo, responsavel.codigo, aluno.parentesco)
                        await parentesco.gravar(client);
                    }
                    await client.query('COMMIT');
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": responsavel.codigo,
                        "mensagem": 'Responsável incluido com sucesso!'
                    });
                }catch(e){
                    await client.query('ROLLBACK');
                    if (e.code === '23505') {
                        resposta.status(400).json({
                            "status": false,
                            "mensagem": 'RG já cadastrado.'
                        });
                    } else {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": 'Erro ao atualizar o responsavel: ' + e.message
                        });
                    }
                } finally {
                    await client.release();
                }
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Por favor, informe o nome da responsavel!'
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método POST para cadastrar uma responsavel!'
            });
        }
    }

    async atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            const nome = dados.nome;
            const rg = dados.rg;
            const cpf = dados.cpf;
            const email = dados.email;
            const telefone = dados.telefone;
            const celular = dados.celular;
            const alunos = dados.alunos;
            const responsavel = new Responsavel(0, nome, rg, cpf, email, telefone, celular, alunos); 
            if (codigo>=0 && nome && rg && cpf && email && telefone && celular) {
                const client = await poolConexao.getInstance().connect();
                try{
                    await client.query('BEGIN');
                    const parentescos = new Parentesco();
                    const parentescoDoResponsavel = await parentescos.consultarResponsavel(responsavel.codigo, client);
                    const alunosFaltantes = parentescoDoResponsavel.filter(aluno => {
                        return !responsavel.alunos.some(responsavelAluno => responsavelAluno.codigo === aluno.codigoAluno);
                    });
                    for(const aluno of alunosFaltantes){
                        const alu = new Aluno(aluno.codigoAluno);
                        const par = new Parentesco(alu.codigo, responsavel.codigo,aluno.parentesco);
                        await par.gravar(client);
                    }
                    const alunosNovos = responsavel.alunos.filter(aluno =>{
                        return !parentescoDoResponsavel.some(parentesco => parentesco.codigoAluno === aluno.codigo);
                    }
                    );
                    for(const aluno of alunosNovos){
                        const alu = new Aluno(aluno.codigoAluno);
                        const par = new Parentesco(alu.codigo, responsavel.codigo,aluno.parentesco);
                        await par.gravar(client);
                    }
                    const parentescosAtuais = parentescoDoResponsavel.filter(aluno => {
                        return responsavel.alunos.some(responsavelAluno => responsavelAluno.codigo === aluno.codigoAluno);
                    });
                    for(const aluno of parentescosAtuais){
                        const alunoAtualizado = responsavel.alunos.find(responsavelAluno => responsavelAluno.codigo === aluno.codigoAluno);
                        if(aluno.parentesco !== alunoAtualizado.parentesco){
                            const alu = new Aluno(aluno.codigoAluno);
                            const par = new Parentesco(alu.codigo, responsavel.codigo,aluno.parentesco);
                            await par.gravar(client);
                        }
                    }
                    await responsavel.atualizar(client);
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": responsavel.codigo,
                        "mensagem": 'Responsavel alterado com sucesso!'
                    });
                    await client.query('COMMIT');
                } catch(e){
                    await client.query('ROLLBACK');
                    if (e.code === '23505') {
                        resposta.status(400).json({
                            "status": false,
                            "mensagem": 'RG já cadastrado.'
                        });
                    } else {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": 'Erro ao atualizar o responsavel: ' + e.message
                        });
                    }
                } finally {
                    client.release();
                }
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Por favor, informe o codigo e o nome da responsavel!'
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize os métodos PUT ou PATCH para atualizar uma responsavel!'
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            if (codigo>=0) {
                const client = await poolConexao.getInstance().connect();
                try{
                    await client.query('BEGIN');
                    const responsavel = new Responsavel(codigo);
                    await responsavel.excluir(client);
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": responsavel.codigo,
                        "mensagem": 'Responsável excluído com sucesso!'
                    });
                    await client.query('COMMIT');
                }catch(e){
                    await client.query('ROLLBACK');
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": 'Erro ao excluir o responsavel: ' + e.message
                        });
                }

            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Por favor, informe o codigo da responsavel!'
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize os métodos DELETE para excluir uma responsavel!'
            });
        }
    }

    async consultar(requisicao, resposta) {
        resposta.type('application/json');
        let termo = requisicao.params.termo;
        console.log(requisicao);
        console.log(requisicao.params);
        console.log(requisicao.params.termo);
        if (!termo) {
            termo = '';
        }
        if (requisicao.method === 'GET') {
            const client = await poolConexao.getInstance().connect();
            const responsaveis = new Responsavel();
            responsaveis.consultar(termo, client).then((listaResponsaveis) => {
                resposta.json({
                    "status": true,
                    "listaResponsaveis": listaResponsaveis
                });
                client.query('COMMIT');
            }).catch((erro) => {
                client.query('ROLLBACK');
                resposta.status(500).json({
                    "status": false,
                    "mensagem": 'Erro ao consultar as responsaveis: ' + erro.message
                });
            });
            client.release();
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método GET para consultar as responsaveis!'
            });
        }
    }
}