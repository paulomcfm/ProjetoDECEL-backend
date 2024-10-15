import Pagamento from "../modelo/pagamento.js";

export default class PagamentoDAO {
    async gravar(pagamento, client) {
        if (pagamento instanceof Pagamento) {
            const sql = "INSERT INTO pagamentos(pag_mes,pag_ano,pag_valorPagamento) VALUES($1,$2,$3);";
            const parametros = [pagamento.mes, pagamento.ano, pagamento.valorPagamento];
            await client.query(sql, parametros);
            const resultado = await client.query("SELECT * FROM pagamentos;");
            console.log("Tabela de Pagamentos:");
            console.table(resultado.rows); 
        }
    }
}