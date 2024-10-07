import Recebimento from "../modelo/recebimento.js";

export default class RecebimentoDAO {
    async gravar(recebimento, client) {
        if (recebimento instanceof Recebimento) {
            const sql = "INSERT INTO recebimentos(rec_mes,rec_ano,rec_valorMensalidade,rec_valorRecebimento,rec_status,rec_tipo,alu_codigo) VALUES($1,$2,$3,$4,$5,$6,$7);";
            const parametros = [recebimento.mes, recebimento.ano, recebimento.valorMensalidade, recebimento.valorRecebimento, recebimento.status, recebimento.tipo, recebimento.aluno];

            await client.query(sql, parametros);
        }
    }

    async atualizar(recebimento, client) {
        if (recebimento instanceof Recebimento) {
            const sql = "UPDATE recebimentos SET alu_nome = $1, alu_rg = $2, alu_observacoes = $3, alu_dataNasc = $4, alu_celular = $5, alu_status = $6, alu_motivoInativo = $7 WHERE alu_codigo = $8";
            const parametros = [recebimento.nome, recebimento.rg, recebimento.observacoes, recebimento.dataNasc, recebimento.celular, recebimento.status, recebimento.motivoInativo, recebimento.codigo];

            await client.query(sql, parametros);

        }
    }

    async excluir(recebimento, client) {
        if (recebimento instanceof Recebimento) {
            const sql = "DELETE FROM recebimentos WHERE alu_codigo = $1";
            const parametros = [recebimento.codigo];

            await client.query(sql, parametros);

        }
    }

    async consultar(parametroConsulta, client) {
        let sql = '';
        let parametros = [];
        if (!isNaN(parseInt(parametroConsulta))) {
            sql = `SELECT recebimentos.*, responsaveis.*
                FROM recebimentos
                LEFT JOIN parentescos ON recebimentos.alu_codigo = parentescos.alu_codigo
                LEFT JOIN responsaveis ON parentescos.resp_codigo = responsaveis.resp_codigo
                WHERE recebimentos.alu_codigo = $1
                ORDER BY recebimentos.alu_nome, responsaveis.resp_nome;`;
            parametros = [parametroConsulta];
        } else {
            if (!parametroConsulta) {
                parametroConsulta = '';
            }
            sql = `SELECT recebimentos.*, responsaveis.*
                FROM recebimentos
                LEFT JOIN parentescos ON recebimentos.alu_codigo = parentescos.alu_codigo
                LEFT JOIN responsaveis ON parentescos.resp_codigo = responsaveis.resp_codigo
                WHERE recebimentos.alu_nome ILIKE  $1
                ORDER BY recebimentos.alu_nome, responsaveis.resp_nome;`;
            parametros = ['%' + parametroConsulta + '%'];
        }

        const { rows: registros, fields: campos } = await client.query(sql, parametros);
        let listaRecebimentos = [];
        let recebimentoAtual = null;
        for (const registro of registros) {
            if (!recebimentoAtual || recebimentoAtual.codigo !== registro.alu_codigo) {
                if (recebimentoAtual) {
                    listaRecebimentos.push(recebimentoAtual);
                }
                recebimentoAtual = {
                    codigo: registro.alu_codigo,
                    nome: registro.alu_nome,
                    rg: registro.alu_rg,
                    observacoes: registro.alu_observacoes,
                    dataNasc: registro.alu_datanasc,
                    celular: registro.alu_celular,
                    responsaveis: [],
                    status: registro.alu_status,
                    motivoInativo: registro.alu_motivoinativo
                };
            }
            const responsavel = {
                codigo: registro.resp_codigo,
                nome: registro.resp_nome,
                rg: registro.resp_rg,
                cpf: registro.resp_cpf,
                email: registro.resp_email,
                telefone: registro.resp_telefone,
                celular: registro.resp_celular
            };
            if (registro.resp_codigo !== null) {
                recebimentoAtual.responsaveis.push(responsavel);
            }
        }
        if (recebimentoAtual) {
            listaRecebimentos.push(recebimentoAtual);
        }
        return listaRecebimentos;
    }

}