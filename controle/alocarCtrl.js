import Inscricao from "../modelo/inscricao.js";
import poolConexao from "../persistencia/conexao.js";

export default class AlocarCtrl {

    static _instance = null;

    constructor() {
        AlocarCtrl._instance = this;
    }

    static getInstance() {
        if (AlocarCtrl._instance == null)
            new AlocarCtrl();
        return AlocarCtrl._instance;
    }

    async atualizarInscricoes(requisicao, resposta) {
        var ok = true;
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            if (dados.length > 0) {
                const client = await poolConexao.connect();
                try {
                    await client.query('BEGIN');
                    const inscricao = new Inscricao();
                    const inscricoes = await inscricao.consultarPorRota(client, dados[0].rota);
                    //Remove das rotas as incricoes que eram da rota que foi alterada mas não são mais
                    for (const inscricaoEncontrada of inscricoes) {
                        const encontradaEmDados = dados.find(d => d.aluno.codigo === inscricaoEncontrada.aluno.codigo);
                        if (!encontradaEmDados) {
                            inscricaoEncontrada.rota = null;
                            inscricaoEncontrada.dataAlocacao = null;
                            await inscricaoEncontrada.atualizarRota(client).catch((erro) => {
                                ok = false;
                                client.query('ROLLBACK');
                                resposta.status(500).json({
                                    "status": false,
                                    "mensagem": 'Erro ao atualizar a inscrição: ' + erro.message
                                });
                            });
                        }
                    }
                    if (ok && dados[0].aluno.codigo != 0) {
                        //Coloca na rota as inscricoes
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
                                await novaInscricao.atualizarRota(client).catch((erro) => {
                                    ok = false;
                                    client.query('ROLLBACK');
                                    resposta.status(500).json({
                                        "status": false,
                                        "mensagem": 'Erro ao atualizar a inscrição: ' + erro.message
                                    });
                                })
                            }
                        }
                    }
                    if (ok) {
                        resposta.status(200).json({
                            "status": true,
                            "mensagem": 'Inscrições alteradas com sucesso!'
                        });
                        await client.query('COMMIT');
                    }
                    else{
                        await client.query('ROLLBACK');
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": 'Erro ao atualizar a inscrição.'
                        });
                    }
                } catch (erro) {
                    await client.query('ROLLBACK');
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": 'Erro ao atualizar a inscrição: ' + erro.message
                    });
                } finally {
                    client.release();
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Por favor, informe inscrições!'
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize os métodos PUT ou PATCH para atualizar uma inscrição!'
            });
        }
    }
}