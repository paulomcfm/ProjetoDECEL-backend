import Manutencao from "../modelo/manutencao.js";
import PeriodoManutencaoDAO from "./periodoManutencaoDAO.js";

export default class ManutencaoDAO {
    async gravar(manutencao, client) {
        if (manutencao instanceof Manutencao) {
            if (manutencao.tipo === 'preventiva') {
                const periodoManutencaoDAO = new PeriodoManutencaoDAO();
                const periodo = await periodoManutencaoDAO.consultarPorCodigoVeiculo(manutencao.veiculoCodigo, client);
                if (periodo) {
                    const seisMesesAtras = new Date();
                    seisMesesAtras.setMonth(seisMesesAtras.getMonth() + 6); // Corrigir aqui para subtrair 6 meses
                    if (new Date(periodo.pm_data_criacao) < seisMesesAtras) {
                        throw new Error('Ainda não está no tempo de manutenção preventiva.');
                    } else if (new Date(periodo.pm_data_criacao) >= seisMesesAtras) {
                        await periodoManutencaoDAO.excluirPorCodigoVeiculo(manutencao.veiculoCodigo, client);
                    }
                }
            }

            const sql = "INSERT INTO Manutencoes (manu_tipo, manu_data, manu_observacoes, vei_codigo) VALUES ($1, $2, $3, $4) RETURNING manu_codigo";
            const parametros = [manutencao.tipo, manutencao.data, manutencao.observacoes, manutencao.veiculoCodigo];
            const { rows } = await client.query(sql, parametros);
            if (rows.length > 0) {
                manutencao.codigo = rows[0].manu_codigo;
            }

            if (manutencao.tipo === 'preventiva') {
                const sqlPeriodo = "INSERT INTO PeriodoManutencao (vei_codigo, pm_data_criacao) VALUES ($1, $2) RETURNING pm_id";
                const parametrosPeriodo = [manutencao.veiculoCodigo, manutencao.data];
                await client.query(sqlPeriodo, parametrosPeriodo);
            }
        }
    }

    async atualizar(manutencao, client) {
        if (manutencao instanceof Manutencao) {
            const sqlConsulta = "SELECT manu_tipo FROM Manutencoes WHERE manu_codigo = $1";
            const resultadoConsulta = await client.query(sqlConsulta, [manutencao.codigo]);
            const manutencaoAntiga = resultadoConsulta.rows[0];

            if (!manutencaoAntiga) {
                throw new Error('Manutenção não encontrada!');
            }

            const sqlAtualiza = "UPDATE Manutencoes SET manu_tipo = $1, manu_data = $2, manu_observacoes = $3, vei_codigo = $4 WHERE manu_codigo = $5";
            const parametros = [manutencao.tipo, manutencao.data, manutencao.observacoes, manutencao.veiculoCodigo, manutencao.codigo];
            await client.query(sqlAtualiza, parametros);

            if (manutencaoAntiga.manu_tipo === 'preventiva' && manutencao.tipo === 'corretiva') {
                const sqlExclui = "DELETE FROM PeriodoManutencao WHERE vei_codigo = $1";
                await client.query(sqlExclui, [manutencao.veiculoCodigo]);
            }
            if (manutencaoAntiga.manu_tipo === 'corretiva' && manutencao.tipo === 'preventiva') {
                const sqlPeriodo = "INSERT INTO PeriodoManutencao (vei_codigo, pm_data_criacao) VALUES ($1, $2) RETURNING pm_id";
                const parametrosPeriodo = [manutencao.veiculoCodigo, manutencao.data];
                await client.query(sqlPeriodo, parametrosPeriodo);
            }
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
        const listaManutencoes = [];
        for (const registro of registros) {
            const manutencao = new Manutencao(registro.manu_tipo, registro.manu_data, registro.manu_observacoes, registro.vei_codigo, registro.manu_codigo);
            listaManutencoes.push(manutencao);
        }
        return listaManutencoes;
    }

    async consultarPorPlaca(placa, client) {
        const sql = `
            SELECT m.*, v.vei_placa
            FROM Manutencoes m
            INNER JOIN Veiculos v ON m.vei_codigo = v.vei_codigo
            WHERE v.vei_placa = $1
        `;
        const parametros = [placa];
        const { rows: registros } = await client.query(sql, parametros);
        if (registros.length > 0) {
            const registro = registros[0];
            return new Manutencao(registro.manu_tipo, registro.manu_data, registro.manu_observacoes, registro.vei_codigo, registro.manu_codigo);
        } else {
            return null;
        }
    }
}