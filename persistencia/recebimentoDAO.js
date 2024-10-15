import Recebimento from "../modelo/recebimento.js";

export default class RecebimentoDAO {
    async gravar(recebimento, client) {
        if (recebimento instanceof Recebimento) {
            const sql = "INSERT INTO recebimentos(rec_mes,rec_ano,rec_valorMensalidade,rec_valorRecebimento,rec_status,rec_tipo,alu_codigo) VALUES($1,$2,$3,$4,$5,$6,$7);";
            const parametros = [recebimento.mes, recebimento.ano, recebimento.valorMensalidade, recebimento.valorRecebimento, recebimento.status, recebimento.tipo, recebimento.aluno.codigo];
            await client.query(sql, parametros);
            const resultado = await client.query("SELECT * FROM recebimentos;");
            console.log("Tabela de Recebimentos:");
            console.table(resultado.rows); 
        }
    }
}