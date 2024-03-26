import Aluno from "../modelo/aluno.js";

export default class AlunoCtrl {
    gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST') {
            const dados = requisicao.body;
            const nome = dados.nome;
            const rg = dados.rg;
            const observacoes = dados.observacoes;
            const dataNasc = dados.dataNasc;
            const aluno = new Aluno(0, nome, rg, observacoes, dataNasc);
            if (nome && aluno.validarRg(rg) && aluno.validarDataNascimento(dataNasc)) {
                aluno.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": aluno.codigo,
                        "mensagem": 'Aluno incluido com sucesso!'
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": 'Erro ao registrar o aluno: ' + erro.message
                    });
                });
            }
            else {
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

    atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            const nome = dados.nome;
            const rg = dados.rg;
            const observacoes = dados.observacoes;
            const dataNasc = dados.dataNasc;
            const aluno = new Aluno(codigo, nome, rg, observacoes, dataNasc);
            if (codigo>=0 && nome && aluno.validarRg(rg) && aluno.validarDataNascimento(dataNasc)) {
                aluno.atualizar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": aluno.codigo,
                        "mensagem": 'Aluno alterado com sucesso!'
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": 'Erro ao alterar o aluno: ' + erro.message
                    });
                });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Por favor, informe o codigo e o nome do aluno!'
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

    excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            if (codigo>=0) {
                const aluno = new Aluno(codigo);
                aluno.excluir().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": aluno.codigo,
                        "mensagem": 'Aluno excluído com sucesso!'
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": 'Erro ao excluir o aluno: ' + erro.message
                    });
                });
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

    consultar(requisicao, resposta) {
        let termo = requisicao.params.termo;
        if (!termo) {
            termo = '';
        }
        if (requisicao.method === 'GET') {
            const alunos = new Aluno();
            alunos.consultar(termo).then((listaAlunos) => {
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
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método GET para consultar os alunos!'
            });
        }
    }
}