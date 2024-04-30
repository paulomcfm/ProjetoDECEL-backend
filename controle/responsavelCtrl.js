import Responsavel from "../modelo/responsavel.js";
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
    gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const nome = dados.nome;
            const rg = dados.rg;
            const cpf = dados.cpf;
            const email = dados.email;
            const telefone = dados.telefone;
            const celular = dados.celular;
            if (nome && rg && cpf && email && telefone && celular) {
                const responsavel = new Responsavel(0, nome, rg, cpf, email, telefone, celular);
                responsavel.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": responsavel.codigo,
                        "mensagem": 'Responsavel incluida com sucesso!'
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": 'Erro ao registrar a responsavel: ' + erro.message
                    });
                });
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

    atualizar(requisicao, resposta) {
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
            if (codigo>=0 && nome && rg && cpf && email && telefone && celular) {
                const responsavel = new Responsavel(codigo, nome, rg, cpf, email, telefone, celular);
                responsavel.atualizar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": responsavel.codigo,
                        "mensagem": 'Responsavel alterada com sucesso!'
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": 'Erro ao alterar a responsavel: ' + erro.message
                    });
                });
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

    excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            if (codigo>=0) {
                const responsavel = new Responsavel(codigo);
                responsavel.excluir().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": responsavel.codigo,
                        "mensagem": 'Responsavel excluída com sucesso!'
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": 'Erro ao excluir a responsavel: ' + erro.message
                    });
                });
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
            }).catch((erro) => {
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