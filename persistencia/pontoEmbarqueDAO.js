import PontoEmbarque from "../modelo/pontoEmbarque.js";
import poolConexao from "./conexao.js";

export default class PontoEmbarqueDAO {
    async gravar(pontoEmbarque) {
        if (pontoEmbarque instanceof PontoEmbarque) {
            const sql = "INSERT INTO pontos_de_embarque(pde_endereco) VALUES($1)";
            const parametros = [pontoEmbarque.endereco];
            await poolConexao.query(sql, parametros);
            
        }
    }

    async atualizar(pontoEmbarque) {
        if (pontoEmbarque instanceof PontoEmbarque) {
            const sql = "UPDATE pontos_de_embarque SET pde_endereco = $1 WHERE pde_codigo = $2";
            const parametros = [pontoEmbarque.endereco, pontoEmbarque.codigo];
            
            await poolConexao.query(sql, parametros);
            
        }
    }

    async excluir(pontoEmbarque) {
        if (pontoEmbarque instanceof PontoEmbarque) {
            const sql = "DELETE FROM pontos_de_embarque WHERE pde_codigo = $1";
            const parametros = [pontoEmbarque.codigo];
            
            await poolConexao.query(sql, parametros);
            
        }
    }

    async consultar(parametroConsulta) {
        let sql = '';
        let parametros = [];
        if (!isNaN(parseInt(parametroConsulta))) {
            sql = 'SELECT * FROM pontos_de_embarque WHERE pde_codigo = $1 order by pde_endereco';
            parametros = [parametroConsulta];
        }
        else {
            if (!parametroConsulta) {
                parametroConsulta = '';
            }
            sql = "SELECT * FROM pontos_de_embarque WHERE pde_endereco like $1";
            parametros = ['%' + parametroConsulta + '%'];
        }
        
        const { rows: registros, fields: campos } = await poolConexao.query(sql, parametros);
        let listaPontosEmbarque = [];
        for (const registro of registros) {
            const pontoEmbarque = new PontoEmbarque(registro.pde_codigo, registro.pde_endereco);
            listaPontosEmbarque.push(pontoEmbarque);
        }
        return listaPontosEmbarque;
    }
}