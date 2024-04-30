import Parentesco from "../modelo/parentesco.js";
import poolConexao from "../persistencia/conexao.js";

export default class ParentescoCtrl {
    static _instance = null;

    constructor()
    {
        ParentescoCtrl._instance = this;
    }

    static getInstance()
    {
        if(ParentescoCtrl._instance==null)
            new ParentescoCtrl();
        return ParentescoCtrl._instance;
    }

    async  consultarAluno(requisicao, resposta) {
        resposta.type('application/json');
        let termo = requisicao.params.termo;
        if (!termo) {
            termo = '';
        }
        if (requisicao.method === 'GET') {
            const client = await poolConexao.getInstance().connect();
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
    async consultarResponsavel(requisicao, resposta) {
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