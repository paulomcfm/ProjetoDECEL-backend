import Recebimento from "../modelo/recebimento.js";
import poolConexao from "../persistencia/conexao.js";

export default class RecebimentoCtrl {
    static _instance = null;

    constructor() {
        RecebimentoCtrl._instance = this;
    }

    static getInstance() {
        if (RecebimentoCtrl._instance == null)
            new RecebimentoCtrl();
        return RecebimentoCtrl._instance;
    }
    async gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST') {
            const dados = requisicao.body;
            const nome = dados.nome;
            const rg = dados.rg;
            const observacoes = dados.observacoes;
            const dataNasc = dados.dataNasc;
            const celular = dados.celular;
            const responsaveis = dados.responsaveis;
            const status = 'A';
            const motivoInativo = '';
            const recebimento = new Recebimento(0, nome, rg, observacoes, dataNasc, celular, responsaveis, status, motivoInativo);
            if (nome && rg && recebimento.validarDataNascimento(dataNasc)) {
                const client = await poolConexao.getInstance().connect();
                try {
                    await client.query('BEGIN');
                    await recebimento.gravar(client);
                    for (const responsavel of recebimento.responsaveis) {
                        const resp = new Responsavel(responsavel.codigo, responsavel.nome, responsavel.rg, responsavel.cpf, responsavel.email, responsavel.telefone, responsavel.celular);
                        const parentesco = new Parentesco(recebimento, resp, responsavel.parentesco);
                        await parentesco.gravar(client);
                    }
                    await client.query('COMMIT');
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": recebimento.codigo,
                        "mensagem": 'Recebimento incluido com sucesso!'
                    });
                } catch (e) {
                    await client.query('ROLLBACK');
                    if (e.code === '23505') {
                        resposta.status(400).json({
                            "status": false,
                            "mensagem": 'RG já cadastrado.'
                        });
                    } else {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": 'Erro ao atualizar o recebimento: ' + e.message
                        });
                    }
                } finally {
                    await client.release();
                }
            } else if (!recebimento.validarDataNascimento(dataNasc)) {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Data de nascimento inválida.'
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Por favor, informe o nome do recebimento!'
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método POST para cadastrar um recebimento!'
            });
        }
    }

    async atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            const nome = dados.nome;
            const rg = dados.rg;
            const observacoes = dados.observacoes;
            const dataNasc = dados.dataNasc;
            const celular = dados.celular;
            const responsaveis = dados.responsaveis;
            const status = dados.status;
            const motivoInativo = dados.motivoInativo;
            const recebimento = new Recebimento(codigo, nome, rg, observacoes, dataNasc, celular, responsaveis, status, motivoInativo);
            if (codigo >= 0 && nome && rg && recebimento.validarDataNascimento(dataNasc)) {
                const client = await poolConexao.getInstance().connect();
                try {
                    await client.query('BEGIN');
                    const parentescos = new Parentesco();
                    const insc = new Inscricao();
                    let hasInscricao = false;
                    if (recebimento.status === 'I') { 
                        hasInscricao = await insc.hasInscricaoRecebimento(client, codigo, new Date().getFullYear()); 
                    }
                    if (!hasInscricao) {
                        const parentescosDoRecebimento = await parentescos.consultarRecebimento(recebimento.codigo, client);
                        const responsaveisFaltantes = parentescosDoRecebimento.filter(responsavel => {
                            return !recebimento.responsaveis.some(recebimentoResponsavel => recebimentoResponsavel.codigo === responsavel.responsavel.codigo);
                        });
                        for (const parentesco of responsaveisFaltantes) { // remover parentescos que existiam mas não existem mais
                            const resp = new Responsavel(parentesco.responsavel.codigo, parentesco.responsavel.nome, parentesco.responsavel.rg, parentesco.responsavel.cpf, parentesco.responsavel.email, parentesco.responsavel.telefone, parentesco.responsavel.celular);
                            const par = new Parentesco(recebimento, resp, parentesco.parentesco);
                            await par.excluir(client);
                        }
                        const responsaveisNovos = recebimento.responsaveis.filter(responsavel => {
                            return !parentescosDoRecebimento.some(parentesco => parentesco.responsavel.codigo === responsavel.codigo);
                        });
                        for (const responsavel of responsaveisNovos) { // incluir novos parentescos
                            const resp = new Responsavel(responsavel.codigo, responsavel.nome, responsavel.rg, responsavel.cpf, responsavel.email, responsavel.telefone, responsavel.celular);
                            const par = new Parentesco(recebimento, resp, responsavel.parentesco);
                            await par.gravar(client);
                        }
                        const parentescosAtuais = parentescosDoRecebimento.filter(responsavel => {
                            return recebimento.responsaveis.some(recebimentoResponsavel => recebimentoResponsavel.codigo === responsavel.responsavel.codigo);
                        });
                        for (const parentesco of parentescosAtuais) { // atualizar parentescos que já existiam
                            const responsavelAtualizado = recebimento.responsaveis.find(recebimentoResponsavel => recebimentoResponsavel.codigo === parentesco.responsavel.codigo);
                            if (parentesco.parentesco !== responsavelAtualizado.parentesco) {
                                const resp = new Responsavel(parentesco.responsavel.codigo, parentesco.responsavel.nome, parentesco.responsavel.rg, parentesco.responsavel.cpf, parentesco.responsavel.email, parentesco.responsavel.telefone, parentesco.responsavel.celular);
                                const par = new Parentesco(recebimento, resp, responsavelAtualizado.parentesco);
                                await par.atualizar(client);
                            }
                        }
                        await recebimento.atualizar(client);
                        resposta.status(200).json({
                            "status": true,
                            "codigoGerado": recebimento.codigo,
                            "mensagem": 'Recebimento alterado com sucesso!'
                        });
                        await client.query('COMMIT');
                    }
                    else {
                        await client.query('ROLLBACK');
                        resposta.status(400).json({
                            "status": false,
                            "mensagem": 'Recebimento não pode ser alterado pois está inscrito.'
                        });
                    }
                } catch (e) {
                    await client.query('ROLLBACK');
                    if (e.code === '23505') {
                        resposta.status(400).json({
                            "status": false,
                            "mensagem": 'RG já cadastrado.'
                        });
                    } else {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": 'Erro ao atualizar o recebimento: ' + e.message
                        });
                    }
                } finally {
                    client.release();
                }
            }
            else if (!recebimento.validarDataNascimento(dataNasc)) {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Data de nascimento inválida.'
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Por favor, informe o código e o nome do recebimento!'
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize os métodos PUT ou PATCH para atualizar um recebimento!'
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            if (codigo >= 0) {
                const client = await poolConexao.getInstance().connect();
                try {
                    await client.query('BEGIN');
                    const recebimento = new Recebimento(codigo);
                    await recebimento.excluir(client);
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": recebimento.codigo,
                        "mensagem": 'Recebimento excluído com sucesso!'
                    });
                    await client.query('COMMIT');
                } catch (e) {
                    await client.query('ROLLBACK');
                    if (e.code === '23503') {
                        resposta.status(400).json({
                            "status": false,
                            "mensagem": 'Recebimento não pode ser excluído pois está inscrito.'
                        });
                    }
                    else {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": 'Erro ao excluir o recebimento: ' + e.message
                        });
                    }
                } finally {
                    client.release();
                }
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Por favor, informe o codigo do recebimento!'
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize os métodos DELETE para excluir um recebimento!'
            });
        }
    }

    async consultar(requisicao, resposta) {
        let termo = requisicao.params.termo;
        if (!termo) {
            termo = '';
        }
        if (requisicao.method === 'GET') {
            const client = await poolConexao.getInstance().connect();
            const recebimentos = new Recebimento();
            recebimentos.consultar(termo, client).then((listaRecebimentos) => {
                resposta.json({
                    "status": true,
                    "listaRecebimentos": listaRecebimentos
                });
            }).catch((erro) => {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": 'Erro ao consultar os recebimentos: ' + erro.message
                });
            });
            client.release();
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método GET para consultar os recebimentos!'
            });
        }
    }
}