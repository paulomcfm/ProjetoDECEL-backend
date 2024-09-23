import poolConexao from "../persistencia/conexao.js";
import Contas from "../modelo/contas.js";

export default class ContasCtrl {
    static _instance = null;

    constructor() {
        ContasCtrl._instance = this;
    }

    static getInstance() {
        if (ContasCtrl._instance == null)
            new ContasCtrl();
        return ContasCtrl._instance;
    }

    async gravar(requisicao, resposta) {
        const dados = requisicao.body;
        try {
            const contas = new Contas(
                dados.id, 
                dados.valor, 
                dados.descricao, 
                dados.data_vencimento, 
                dados.data_recebimento, 
                dados.status, 
                dados.categoria, 
                dados.observacoes
            );
            const client = await poolConexao.getInstance().connect();
            await client.query('BEGIN');
            try {
                await contas.gravar(client);
                resposta.status(200).json({
                    status: true,
                    mensagem: "Conta gravada com sucesso!"
                });
                await client.query('COMMIT');
            } catch (erro) {
                await client.query('ROLLBACK');
                resposta.status(500).json({
                    status: false,
                    mensagem: "Erro ao gravar conta: " + erro
                });
            } finally {
                await client.release();
            }
        } catch (erro) {
            resposta.status(500).json({
                status: false,
                mensagem: "Erro ao gravar conta: " + erro
            });
        }
    }

    async atualizar(requisicao, resposta) {
        const dados = requisicao.body;
        try {
            const contas = new Contas(
                dados.id, 
                dados.valor, 
                dados.descricao, 
                dados.data_vencimento, 
                dados.data_recebimento, 
                dados.status, 
                dados.categoria, 
                dados.observacoes
            );
            const client = await poolConexao.getInstance().connect();
            await client.query('BEGIN');
            try {
                await contas.atualizar(client);
                resposta.status(200).json({
                    status: true,
                    mensagem: "Conta atualizada com sucesso!"
                });
                await client.query('COMMIT');
            } catch (erro) {
                await client.query('ROLLBACK');
                resposta.status(500).json({
                    status: false,
                    mensagem: "Erro ao atualizar conta: " + erro
                });
            } finally {
                await client.release();
            }
        } catch (erro) {
            resposta.status(500).json({
                status: false,
                mensagem: "Erro ao atualizar conta: " + erro
            });
        }
    }

    async excluir(requisicao, resposta) {
        const id = requisicao.params.id;
        try {
            if (id !== undefined) {
                const client = await poolConexao.getInstance().connect();
                await client.query('BEGIN');
                try {
                    await new Contas().excluir(client, id);
                    await client.query('COMMIT');
                    resposta.status(200).json({
                        status: true,
                        mensagem: "Conta excluída com sucesso!"
                    });
                } catch (erro) {
                    await client.query('ROLLBACK');
                    resposta.status(500).json({
                        status: false,
                        mensagem: "Erro ao excluir conta: " + erro
                    });
                } finally {
                    await client.release();
                }
            } else {
                resposta.status(400).json({
                    status: false,
                    mensagem: "ID da conta não fornecido."
                });
            }
        } catch (erro) {
            resposta.status(500).json({
                status: false,
                mensagem: "Erro ao excluir conta: " + erro
            });
        }
    }

    async consultar(requisicao, resposta) {
        try {
            let termo = requisicao.params.termo || '';
            const client = await poolConexao.getInstance().connect();
            try {
                await client.query('BEGIN');
                const lista = await new Contas().consultar(client, termo);
                resposta.status(200).json({
                    status: true,
                    mensagem: "Contas consultadas com sucesso!",
                    listaContas: lista
                });
                await client.query('COMMIT');
            } catch (erro) {
                await client.query('ROLLBACK');
                resposta.status(500).json({
                    status: false,
                    mensagem: "Erro ao consultar contas: " + erro,
                    listaContas: []
                });
            } finally {
                await client.release();
            }
        } catch (erro) {
            resposta.status(500).json({
                status: false,
                mensagem: "Erro ao consultar contas: " + erro,
                listaContas: []
            });
        }
    }
}