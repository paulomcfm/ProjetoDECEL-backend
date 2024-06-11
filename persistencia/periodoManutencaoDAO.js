export default class PeriodoManutencaoDAO {

    async excluirPorCodigoVeiculo(veiculoCodigo, client) {
        const sql = "DELETE FROM PeriodoManutencao WHERE vei_codigo = $1";
        const parametros = [veiculoCodigo];
        await client.query(sql, parametros);
    }

    async consultarPorCodigoVeiculo(veiculoCodigo, client) {
        const sql = "SELECT * FROM PeriodoManutencao WHERE vei_codigo = $1";
        const parametros = [veiculoCodigo];
        const { rows: registros } = await client.query(sql, parametros);
        if (registros.length > 0) {
            return registros[0];
        } else {
            return null;
        }
    }
}