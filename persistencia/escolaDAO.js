import Escola from "../modelo/escola.js";
import poolConexao from "./conexao.js";

export default class EscolaDAO {
    async gravar(escola) {
        if (escola instanceof Escola) {
            const sql = "INSERT INTO escolas(esc_nome, esc_endereco, esc_tipo) VALUES(?,?,?)";
            const parametros = [escola.nome, escola.endereco, escola.tipo];
            
            const retorno = await poolConexao.query(sql, parametros);
            
        }
    }

    async atualizar(escola) {
        if (escola instanceof Escola) {
            const sql = "UPDATE escolas SET esc_nome = ?, esc_endereco = ?, esc_tipo = ? WHERE esc_codigo = ?";
            const parametros = [escola.nome, escola.endereco, escola.tipo, escola.codigo];
            
            await poolConexao.query(sql, parametros);
            
        }
    }

    async excluir(escola) {
        if (escola instanceof Escola) {
            const sql = "DELETE FROM escolas WHERE esc_codigo = ?";
            const parametros = [escola.codigo];
            
            await poolConexao.query(sql, parametros);
            
        }
    }

    async consultar(parametroConsulta) {
        let sql = '';
        let parametros = [];
        if (!isNaN(parseInt(parametroConsulta))) {
            sql = 'SELECT * FROM escolas WHERE esc_codigo = ? order by esc_nome';
            parametros = [parametroConsulta];
        }
        else {
            if (!parametroConsulta) {
                parametroConsulta = '';
            }
            sql = "SELECT * FROM escolas WHERE esc_nome like ?";
            parametros = ['%' + parametroConsulta + '%'];
        }
        
        const { rows: registros, fields: campos } = await poolConexao.query(sql, parametros);
        let listaEscolas = [];
        for (const registro of registros) {
            const escola = new Escola(registro.esc_codigo, registro.esc_nome, registro.esc_endereco, registro.esc_tipo);
            listaEscolas.push(escola);
        }
        return listaEscolas;
    }
}