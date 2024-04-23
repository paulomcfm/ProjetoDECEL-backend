import Inscricao from "../modelo/inscricao.js";

export default class InscricaoCtrl {
    gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
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
            if (aluno && pontoEmbarque && escola && cep && rua && numero && bairro && periodo && etapa && anoLetivo && turma) {
                const inscricao = new Inscricao(0, aluno, pontoEmbarque, escola, null, '', cep, rua, numero, bairro, periodo, etapa, anoLetivo, turma, '');
                inscricao.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": inscricao.codigo,
                        "mensagem": 'Inscrição incluida com sucesso!'
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": 'Erro ao registrar a inscrição: ' + erro.message
                    });
                });
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

    atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
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
            if (codigo >= 0 && aluno && pontoEmbarque && escola && cep && rua && numero && bairro && periodo && etapa && anoLetivo && turma) {
                const inscricao = new Inscricao(codigo, aluno, pontoEmbarque, escola, null, '', cep, rua, numero, bairro, periodo, etapa, anoLetivo, turma, '');
                inscricao.atualizar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": inscricao.codigo,
                        "mensagem": 'Inscrição alterada com sucesso!'
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": 'Erro ao alterar a inscrição: ' + erro.message
                    });
                });
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

    excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            if (codigo >= 0) {
                const inscricao = new Inscricao(codigo);
                inscricao.excluir().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": inscricao.codigo,
                        "mensagem": 'Inscrição excluída com sucesso!'
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": 'Erro ao excluir a inscrição: ' + erro.message
                    });
                });
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

    consultar(requisicao, resposta) {
        resposta.type('application/json');
        let termo = requisicao.params.termo;
        if (!termo) {
            termo = '';
        }
        if (requisicao.method === 'GET') {
            const inscricoes = new Inscricao();
            inscricoes.consultar(termo).then((listaInscricoes) => {
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
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método GET para consultar as inscrições!'
            });
        }
    }
}