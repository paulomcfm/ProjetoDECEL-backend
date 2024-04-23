import Parentesco from "../modelo/parentesco.js";
import poolConexao from "../persistencia/conexao.js";

export default class ParentescoCtrl {
    static _instance = null;

    constructor() {
        if (ParentescoCtrl._instance) {
            return ParentescoCtrl._instance
        }
        ParentescoCtrl._instance = this;
    }
    static async  gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST') {
            const dados = requisicao.body;
            const codigoAluno = dados.codigoAluno;
            const codigoResponsavel = dados.codigoResponsavel;
            const par = dados.parentesco;
            const parentesco = new Parentesco(codigoAluno, codigoResponsavel, par);
            if (codigoAluno > 0 && codigoResponsavel > 0 && par) {
                parentesco.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": 'Parentesco incluido com sucesso!'
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": 'Erro ao registrar o parentesco: ' + erro.message
                    });
                });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Por favor, informe o parentesco!'
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método POST para cadastrar um parentesco!'
            });
        }
    }

    static async  atualizar(requisicao, resposta) {
        resposta.type('application/json');
        const codigoAluno = requisicao.body.codigoAluno;
        const codigoResponsavel = requisicao.body.codigoResponsavel;
        const par = requisicao.body.parentesco;
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const parentesco = new Parentesco(codigoAluno, codigoResponsavel, par);
            if (codigoAluno > 0 && codigoResponsavel > 0 && par) {
                parentesco.atualizar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": 'Parentesco alterado com sucesso!'
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": 'Erro ao alterar o parentesco: ' + erro.message
                    });
                });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Por favor, informe o parentesco!'
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize os métodos PUT ou PATCH para atualizar um parentesco!'
            });
        }
    }

    static async  excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigoAluno = dados.codigoAluno;
            const codigoResponsavel = dados.codigoResponsavel;
            if (codigoAluno > 0 && codigoResponsavel > 0) {
                const parentesco = new Parentesco(codigoAluno, codigoResponsavel, '');
                parentesco.excluir().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": 'Parentesco excluído com sucesso!'
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": 'Erro ao excluir o parentesco: ' + erro.message
                    });
                });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Por favor, informe o codigo do parentesco!'
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize os métodos DELETE para excluir um parentesco!'
            });
        }
    }

    static async  consultar(requisicao, resposta) {
        resposta.type('application/json');
        let termo = requisicao.params.termo;
        if (!termo) {
            termo = '';
        }
        if (requisicao.method === 'GET') {
            const parentescos = new Parentesco();
            parentescos.consultar(termo).then((listaParentescos) => {
                resposta.json({
                    "status": true,
                    "listaParentescos": listaParentescos
                });
            }).catch((erro) => {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": 'Erro ao consultar os parentescos: ' + erro.message
                });
            });
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método GET para consultar os parentescos!'
            });
        }
    }

    static async  consultarAluno(requisicao, resposta) {
        resposta.type('application/json');
        let termo = requisicao.params.termo;
        if (!termo) {
            termo = '';
        }
        if (requisicao.method === 'GET') {
            const client = await poolConexao.connect();
            const parentescos = new Parentesco();
            parentescos.consultarAluno(termo, client).then((listaParentescos) => {
                resposta.json({
                    "status": true,
                    "listaParentescos": listaParentescos
                });
            }).catch((erro) => {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": 'Erro ao consultar os parentescos: ' + erro.message
                });
            });
            client.release();
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método GET para consultar os parentescos!'
            });
        }
    }
    static async consultarResponsavel(requisicao, resposta) {
        resposta.type('application/json');
        let termo = requisicao.params.termo;
        if (!termo) {
            termo = '';
        }
        if (requisicao.method === 'GET') {
            const parentescos = new Parentesco();
            parentescos.consultarResponsavel(termo).then((listaParentescos) => {
                resposta.json({
                    "status": true,
                    "listaParentescos": listaParentescos
                });
            }).catch((erro) => {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": 'Erro ao consultar os parentescos: ' + erro.message
                });
            });
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método GET para consultar os parentescos!'
            });
        }
    }
}