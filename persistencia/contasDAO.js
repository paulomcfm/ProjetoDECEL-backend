import Contas from "../modelo/contas.js";

export default class ContasDAO {

    async gravar(client, contas) {
        try {
            let sql = `INSERT INTO Contas (con_valor, con_descricao, con_data_vencimento, con_data_recebimento, con_status, con_categoria, con_data_criacao, con_observacoes) 
                       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE, $7)`;
            let values = [contas.valor, contas.descricao, contas.data_vencimento, contas.data_recebimento, contas.status, contas.categoria, contas.observacoes];
            await client.query(sql, values);
        } catch (erro) {
            throw erro;
        }
    }

    async atualizar(client, contas) {
        try {
            let sql = `UPDATE Contas 
                       SET con_valor = $2, con_descricao = $3, con_data_vencimento = $4, con_data_recebimento = $5, con_status = $6, con_categoria = $7, con_observacoes = $8 
                       WHERE con_id = $1`;
            let values = [contas.id, contas.valor, contas.descricao, contas.data_vencimento, contas.data_recebimento, contas.status, contas.categoria, contas.observacoes];
            await client.query(sql, values);
        } catch (erro) {
            throw erro;
        }
    }

    async excluir(client, id) {
        try {
            let sql = `DELETE FROM Contas WHERE con_id = $1`;
            let values = [id];
            await client.query(sql, values);
        } catch (erro) {
            throw erro;
        }
    }

    async consultar(client, termo) {
        try {
            let sql = '';
            let values = [];
            if (termo === '') {
                sql = 'SELECT * FROM Contas';
            } else {
                sql = 'SELECT * FROM Contas WHERE con_descricao ILIKE $1';
                values = [`%${termo}%`];
            }

            const { rows: registros, fields: campos } = await client.query(sql, values);
            let lista = [];
            for (const registro of registros) {
                lista.push(new Contas(
                    registro.con_id, 
                    registro.con_valor, 
                    registro.con_descricao, 
                    registro.con_data_vencimento, 
                    registro.con_data_recebimento, 
                    registro.con_status, 
                    registro.con_categoria, 
                    registro.con_data_criacao, 
                    registro.con_observacoes
                ));
            }
            return lista;
        } catch (erro) {
            throw erro;
        }
    }
}