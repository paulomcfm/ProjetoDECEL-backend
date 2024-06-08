import Manutencao from "../modelo/manutencao.js";
import PeriodoManutencaoDAO from "./periodoManutencaoDAO.js";

export default class ManutencaoDAO {
    async gravar(manutencao, client) {
        if (manutencao instanceof Manutencao) {
            if (manutencao.tipo === 'preventiva') {
                const periodoManutencaoDAO = new PeriodoManutencaoDAO();
                const periodo = await periodoManutencaoDAO.consultarPorPlaca(manutencao.placa, client);
                if (periodo) {
                    const seisMesesAtras = new Date();
                    seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6);
                    if (new Date(periodo.pm_data_criacao) > seisMesesAtras) {
                        throw new Error('Ainda não está no tempo de manutenção preventiva.');
                    } else {
                        await periodoManutencaoDAO.excluirPorPlaca(manutencao.placa, client);
                    }
                }
            }

            const sql = "INSERT INTO Manutencoes (manu_tipo, manu_data, manu_observacoes, vei_codigo) VALUES ($1, $2, $3, $4) RETURNING manu_codigo";
            const parametros = [manutencao.tipo, manutencao.data, manutencao.observacoes, manutencao.id];
            console.log(sql, parametros);
            const { rows } = await client.query(sql, parametros);
            if (rows.length > 0) {
                manutencao.codigo = rows[0].manu_codigo;
            }

            if (manutencao.tipo === 'preventiva') {
                const periodoManutencaoDAO = new PeriodoManutencaoDAO();
                await periodoManutencaoDAO.gravar(manutencao.placa, client);
            }
        }
    }

    async atualizar(manutencao, client) {
        if (manutencao instanceof Manutencao) {
            const sql = "UPDATE Manutencoes SET manu_tipo = $1, manu_data = $2, manu_observacoes = $3 WHERE manu_codigo = $4";
            const parametros = [manutencao.tipo, manutencao.data, manutencao.observacoes, manutencao.codigo];
            await client.query(sql, parametros);
        }
    }

    async excluir(manutencao, client) {
        if (manutencao instanceof Manutencao) {
            const sql = "DELETE FROM Manutencoes WHERE manu_codigo = $1";
            const parametros = [manutencao.codigo];
            await client.query(sql, parametros);
        }
    }

    async consultar(client) {
        const sql = "SELECT * FROM Manutencoes";
        const { rows: registros } = await client.query(sql);
        console.log(registros);
        const listaManutencoes = [];
        for (const registro of registros) {
            const manutencao = new Manutencao(registro.manu_tipo, registro.manu_data, registro.manu_observacoes, registro.vei_placa, registro.manu_codigo);
            listaManutencoes.push(manutencao);
        }
        return listaManutencoes;
    }

    async consultarPorPlaca(placa, client) {
        const sql = "SELECT * FROM Manutencoes WHERE vei_placa = $1";
        const parametros = [placa];
        const { rows: registros } = await client.query(sql, parametros);
        if (registros.length > 0) {
            const registro = registros[0];
            return new Manutencao(registro.manu_codigo, registro.manu_tipo, registro.manu_data, registro.manu_observacoes, registro.vei_placa);
        } else {
            return null;
        }
    }
}
