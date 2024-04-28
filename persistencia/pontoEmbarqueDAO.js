import PontoEmbarque from "../modelo/pontoEmbarque.js";

export default class PontoEmbarqueDAO {
    async gravar(client, pontoEmbarque) {
        if (pontoEmbarque instanceof PontoEmbarque) {
            const sql = "INSERT INTO pontosdeembarque(pde_rua, pde_numero, pde_bairro, pde_cep) VALUES($1, $2, $3, $4)";
            const parametros = [pontoEmbarque.rua, pontoEmbarque.numero, pontoEmbarque.bairro, pontoEmbarque.cep];
            await client.query(sql, parametros);
        }
    }

    async atualizar(client, pontoEmbarque) {
        if (pontoEmbarque instanceof PontoEmbarque) {
            const sql = "UPDATE pontosdeembarque SET pde_rua = $1, pde_numero = $2, pde_bairro = $3, pde_cep = $4 WHERE pde_codigo = $5";
            const parametros = [pontoEmbarque.rua, pontoEmbarque.numero, pontoEmbarque.bairro, pontoEmbarque.cep, pontoEmbarque.codigo];
            await client.query(sql, parametros);
        }
    }

    async excluir(client, pontoEmbarque) {
        if (pontoEmbarque instanceof PontoEmbarque) {
            const sql = "DELETE FROM pontosdeembarque WHERE pde_codigo = $1";
            const parametros = [pontoEmbarque.codigo];
            await client.query(sql, parametros);
        }
    }

    async consultar(client, parametroConsulta) {
        let sql = '';
        let parametros = [];
        if (!isNaN(parseInt(parametroConsulta))) {
            sql = 'SELECT * FROM pontosdeembarque WHERE pde_codigo = $1 order by pde_bairro';
            parametros = [parametroConsulta];
        }
        else {
            if (!parametroConsulta) {
                parametroConsulta = '';
            }
            sql = "SELECT * FROM pontosdeembarque WHERE pde_rua like $1 order by pde_bairro";
            parametros = ['%' + parametroConsulta + '%'];
        }

        const { rows: registros, fields: campos } = await client.query(sql, parametros);
        let listaPontosEmbarque = [];
        for (const registro of registros) {
            const pontoEmbarque = new PontoEmbarque(registro.pde_codigo, registro.pde_rua, registro.pde_numero, registro.pde_bairro, registro.pde_cep);
            listaPontosEmbarque.push(pontoEmbarque);
        }
        return listaPontosEmbarque;
    }
}