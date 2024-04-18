import PontoEmbarque from "../modelo/pontoEmbarque.js";

export default class PontoEmbarqueCtrl {
    gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const rua = dados.rua;
            const numero = dados.numero;
            const bairro = dados.bairro;
            const cep = dados.cep;
            if (rua && numero && bairro && cep) {
                const pontoEmbarque = new PontoEmbarque(0, rua, numero, bairro, cep);
                pontoEmbarque.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": pontoEmbarque.codigo,
                        "mensagem": 'Ponto de embarque incluido com sucesso!'
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": 'Erro ao registrar o ponto de embarque: ' + erro.message
                    });
                });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Por favor, informe todos os dados de ponto de embarque!'
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método POST para cadastrar um ponto de embarque!'
            });
        }
    }

    atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            const rua = dados.rua;
            const numero = dados.numero;
            const bairro = dados.bairro;
            const cep = dados.cep;
            if (codigo>=0 && rua && numero && bairro && cep) {
                const pontoEmbarque = new PontoEmbarque(codigo, rua, numero, bairro, cep);
                pontoEmbarque.atualizar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": pontoEmbarque.codigo,
                        "mensagem": 'Ponto de embarque alterado com sucesso!'
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": 'Erro ao alterar o ponto de embarque: ' + erro.message
                    });
                });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Por favor, informe o codigo e o endereço do ponto de embarque!'
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize os métodos PUT ou PATCH para atualizar um ponto de embarque!'
            });
        }
    }

    excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            if (codigo>=0) {
                const pontoEmbarque = new PontoEmbarque(codigo);
                pontoEmbarque.excluir().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": pontoEmbarque.codigo,
                        "mensagem": 'Ponto de embarque excluído com sucesso!'
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": 'Erro ao excluir o ponto de embarque: ' + erro.message
                    });
                });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Por favor, informe o codigo do ponto de embarque!'
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize os métodos DELETE para excluir um ponto de embarque!'
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
            const pontosEmbarque = new PontoEmbarque();
            pontosEmbarque.consultar(termo).then((listaPontosEmbarque) => {
                resposta.json({
                    "status": true,
                    "listaPontosEmbarque": listaPontosEmbarque
                });
            }).catch((erro) => {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": 'Erro ao consultar os pontos de embarque: ' + erro.message
                });
            });
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método GET para consultar os pontos de embarque!'
            });
        }
    }
}