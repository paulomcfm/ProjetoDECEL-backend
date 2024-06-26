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
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            if (dados.length > 0) {
                const client = await poolConexao.getInstance().connect();
                try {
                    await client.query('BEGIN');
                    const inscricao = new Inscricao();
                    const inscricoes = await inscricao.consultarPorRota(client, dados[0].rota);
                    //Remove das rotas as incricoes que eram da rota que foi alterada mas não são mais
                    for (const inscricaoEncontrada of inscricoes) {
                        const encontradaEmDados = dados.find(d => d.aluno.codigo === inscricaoEncontrada.aluno.codigo);
                        if (!encontradaEmDados) {
                            const insc = new Inscricao(inscricaoEncontrada.ano, inscricaoEncontrada.aluno, inscricaoEncontrada.pontoEmbarque, inscricaoEncontrada.escola, inscricaoEncontrada.rota, inscricaoEncontrada.cep, inscricaoEncontrada.rua, inscricaoEncontrada.numero, inscricaoEncontrada.bairro, inscricaoEncontrada.periodo, inscricaoEncontrada.etapa, inscricaoEncontrada.anoLetivo, inscricaoEncontrada.turma, inscricaoEncontrada.dataAlocacao);
                            insc.rota = null;
                            insc.dataAlocacao = null;
                            await insc.atualizarRota(client);
                        }
                    }
                    if (dados[0].aluno.codigo != 0) {
                        //Coloca na rota novas inscricoes e atualiza as que já estavam na rota
                        for (const inscricao of dados) {
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
                            await novaInscricao.atualizarRota(client);
                        }
                    }
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": 'Inscrições alteradas com sucesso!'
                    });
                    await client.query('COMMIT');
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