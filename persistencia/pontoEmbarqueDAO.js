import PontoEmbarque from "../modelo/pontoEmbarque.js";
import conectar from "./conexao.js";

export default class PontoEmbarqueDAO {
    async gravar(pontoEmbarque) {
        if (pontoEmbarque instanceof PontoEmbarque) {
            const sql = "INSERT INTO pontos_de_embarque(pde_endereco) VALUES(?)";
            const parametros = [pontoEmbarque.endereco];
            const conexao = await conectar();
            const retorno = await conexao.query(sql, parametros);
            pontoEmbarque.codigo = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(pontoEmbarque) {
        if (pontoEmbarque instanceof PontoEmbarque) {
            const sql = "UPDATE pontos_de_embarque SET pde_endereco = ? WHERE pde_codigo = ?";
            const parametros = [pontoEmbarque.endereco, pontoEmbarque.codigo];
            const conexao = await conectar();
            await conexao.query(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(pontoEmbarque) {
        if (pontoEmbarque instanceof PontoEmbarque) {
            const sql = "DELETE FROM pontos_de_embarque WHERE pde_codigo = ?";
            const parametros = [pontoEmbarque.codigo];
            const conexao = await conectar();
            await conexao.query(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(parametroConsulta) {
        let sql = '';
        let parametros = [];
        if (!isNaN(parseInt(parametroConsulta))) {
            sql = 'SELECT * FROM pontos_de_embarque WHERE pde_codigo = ? order by pde_endereco';
            parametros = [parametroConsulta];
        }
        else {
            if (!parametroConsulta) {
                parametroConsulta = '';
            }
            sql = "SELECT * FROM pontos_de_embarque WHERE pde_endereco like ?";
            parametros = ['%' + parametroConsulta + '%'];
        }
        const conexao = await conectar();
        const { rows: registros, fields: campos } = await client.query(sql, parametros);
        let listaPontosEmbarque = [];
        for (const registro of registros) {
            const pontoEmbarque = new PontoEmbarque(registro.pde_codigo, registro.pde_endereco);
            listaPontosEmbarque.push(pontoEmbarque);
        }
        return listaPontosEmbarque;
    }
}