import Manutencao from "../modelo/manutencao";

export default class PeriodoManutencaoDAO {
    async gravar(placa, client) {
        const sql = "INSERT INTO PeriodoManutencao (vei_placa) VALUES ($1)";
        const parametros = [placa];
        await client.query(sql, parametros);
    }

    async excluirPorPlaca(placa, client) {
        const sql = "DELETE FROM PeriodoManutencao WHERE vei_placa = $1";
        const parametros = [placa];
        await client.query(sql, parametros);
    }

    async consultarPorPlaca(placa, client) {
        const sql = "SELECT * FROM PeriodoManutencao WHERE vei_placa = $1";
        const parametros = [placa];
        const { rows: registros } = await client.query(sql, parametros);
        if (registros.length > 0) {
            return registros[0];
        } else {
            return null;
        }
    }
}