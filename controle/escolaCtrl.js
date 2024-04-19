import Escola from "../modelo/escola.js";

export default class EscolaCtrl {
    gravar(requisicao, resposta) {
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
                escola.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": escola.codigo,
                        "mensagem": 'Escola incluida com sucesso!'
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": 'Erro ao registrar a escola: ' + erro.message
                    });
                });
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

    atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            const nome = dados.nome;
            const tipo = dados.tipo;
            const email = dados.email;
            const telefone = dados.telefone;
            const pontoEmbarque = dados.pontoEmbarque;
            if (codigo>=0 && nome && tipo && email && telefone && pontoEmbarque) {
                const escola = new Escola(codigo, nome, tipo, email, telefone, pontoEmbarque);
                escola.atualizar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": escola.codigo,
                        "mensagem": 'Escola alterada com sucesso!'
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": 'Erro ao alterar a escola: ' + erro.message
                    });
                });
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

    excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            if (codigo>=0) {
                const escola = new Escola(codigo);
                escola.excluir().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": escola.codigo,
                        "mensagem": 'Escola excluída com sucesso!'
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": 'Erro ao excluir a escola: ' + erro.message
                    });
                });
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

    consultar(requisicao, resposta) {
        resposta.type('application/json');
        let termo = requisicao.params.termo;
        if (!termo) {
            termo = '';
        }
        if (requisicao.method === 'GET') {
            const escolas = new Escola();
            escolas.consultar(termo).then((listaEscolas) => {
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
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método GET para consultar as escolas!'
            });
        }
    }
}