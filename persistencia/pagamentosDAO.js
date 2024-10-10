import Pagamento from "../modelo/pagamento";

export default class PagamentoDAO {
    async gravar(pagamento, client) {
        if(pagamento instanceof Pagamento) {
            const sql = `
                INSERT INTO Pagamentos (pag_mes, pag_ano, pag_valorPagamento, pag_status, pag_tipo)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING pag_codigo
            `;
            const parametros = [
                pagamento.mes, 
                pagamento.ano, 
                pagamento.valorPagamento, 
                pagamento.status, 
                pagamento.tipo
            ];
            const { rows } = await client.query(sql, parametros);
            if (rows.length > 0) {
                pagamento.codigo = rows[0].pag_codigo;
            }
        }
    }

    async atualizar(pagamento, client) {
        if(pagamento instanceof Pagamento) {
            const sql = `
                UPDATE Pagamentos
                SET pag_mes = $1, pag_ano = $2, pag_valorPagamento = $3, pag_status = $4, pag_tipo = $5
                WHERE pag_codigo = $6
            `;
            const parametros = [
                pagamento.mes, 
                pagamento.ano, 
                pagamento.valorPagamento, 
                pagamento.status, 
                pagamento.tipo, 
                pagamento.codigo
            ];
            await client.query(sql, parametros);
        }
    }

    async excluir(pagamento, client) {
        if(pagamento instanceof Pagamento) {
            const sql = "DELETE FROM Pagamentos WHERE pag_codigo = $1";
            const parametros = [pagamento.codigo];
            await client.query(sql, parametros);
        }
    }

    async consultar(client) {
        if(pagamento instanceof Pagamento) {
            const sql = "SELECT * FROM Pagamentos";
            const { rows: registros } = await client.query(sql);
            const listaPagamentos = [];
            for (const registro of registros) {
                const pagamento = {
                    codigo: registro.pag_codigo,
                    mes: registro.pag_mes,
                    ano: registro.pag_ano,
                    valorPagamento: registro.pag_valorPagamento,
                    status: registro.pag_status,
                    tipo: registro.pag_tipo
                };
                listaPagamentos.push(pagamento);
            }
            return listaPagamentos;
        }
    }
}
