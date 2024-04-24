import Inscricao from "../modelo/inscricao.js";

export default class InscricaoCtrl {
    gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;  
            const data = new Date();
            const ano = data.getFullYear();
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
            if (ano >= 0 && aluno && pontoEmbarque && escola && cep && rua && numero && bairro && periodo && etapa && anoLetivo && turma) {
                const inscricao = new Inscricao(ano, aluno, pontoEmbarque, escola, null, cep, rua, numero, bairro, periodo, etapa, anoLetivo, turma, '');
                inscricao.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
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
            const ano = dados.ano;
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
            if (ano >= 0 && aluno && pontoEmbarque && escola && cep && rua && numero && bairro && periodo && etapa && anoLetivo && turma) {
                const inscricao = new Inscricao(ano, aluno, pontoEmbarque, escola, null, cep, rua, numero, bairro, periodo, etapa, anoLetivo, turma, '');
                inscricao.atualizar().then(() => {
                    resposta.status(200).json({
                        "status": true,
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

    atualizarInscricoes(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            if (dados.length > 0) {
                const inscricao = new Inscricao();
                inscricao.consultarPorRota(dados[0].rota).then((inscricoes) => {
                    for (const inscricaoEncontrada of inscricoes) {
                        const encontradaEmDados = dados.find(d => d.aluno.codigo === inscricaoEncontrada.aluno.codigo);
                        if (!encontradaEmDados) {
                            inscricaoEncontrada.rota = null;
                            inscricaoEncontrada.dataAlocacao = null;
                            inscricaoEncontrada.atualizarRota();
                        }
                    }
                    for (const inscricao of dados) {
                        const naoEncontradaNaConsulta = inscricoes.every(i => i.aluno.codigo !== inscricao.aluno.codigo);
                        if (naoEncontradaNaConsulta) {
                            const novaInscricao = new Inscricao(
                                inscricao.ano,
                                inscricao.aluno,
                                inscricao.pontoEmbarque,
                                inscricao.escola,
                                inscricao.rota,
                                inscricao.cep,
                                inscricao.rua,
                                inscricao.numero,
                                inscricao.bairro,
                                inscricao.periodo,
                                inscricao.etapa,
                                inscricao.anoLetivo,
                                inscricao.turma,
                                inscricao.dataAlocacao
                            );
                            novaInscricao.atualizarRota();
                        }
                    }
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": 'Inscrições alteradas com sucesso!'
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": 'Erro ao alterar as inscrições: ' + erro.message
                    });
                });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Por favor, informe inscrições!'
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
            const ano = dados.ano;
            const aluno = dados.aluno;
            if (aluno.codigo >= 0 && ano >= 0) {
                const inscricao = new Inscricao(ano, aluno);
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