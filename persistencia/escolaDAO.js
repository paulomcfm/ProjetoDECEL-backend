import Escola from "../modelo/escola.js";
import poolConexao from "./conexao.js";

export default class EscolaDAO {
    async gravar(escola) {
        if (escola instanceof Escola) {
            const sql = "INSERT INTO escolas(esc_nome, esc_tipo, esc_rua, esc_numero, esc_cidade, esc_bairro, esc_cep, esc_email, esc_telefone) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)";
            const parametros = [escola.nome, escola.tipo, escola.rua, escola.numero, escola.cidade, escola.bairro, escola.cep, escola.email, escola.telefone];
            const retorno = await poolConexao.query(sql, parametros);
        }
    }

    async atualizar(escola) {
        if (escola instanceof Escola) {
            const sql = "UPDATE escolas SET esc_nome = $1, esc_tipo = $2, esc_rua = $3, esc_numero = $4, esc_cidade = $5, esc_bairro = $6, esc_cep = $7, esc_email = $8, esc_telefone = $9 WHERE esc_codigo = $10";
            const parametros = [escola.nome, escola.tipo, escola.rua, escola.numero, escola.cidade, escola.bairro, escola.cep, escola.email, escola.telefone, escola.codigo];
            const retorno = await poolConexao.query(sql, parametros);
        }
    }

    async excluir(escola) {
        if (escola instanceof Escola) {
            const sql = "DELETE FROM escolas WHERE esc_codigo = ?";
            const parametros = [escola.codigo];
            const retorno = await poolConexao.query(sql, parametros);
        }
    }

    async consultar(parametroConsulta) {
        let sql = '';
        let parametros = [];
        if (!isNaN(parseInt(parametroConsulta))) {
            sql = 'SELECT * FROM escolas WHERE esc_codigo = $1 order by esc_nome';
            parametros = [parametroConsulta];
        }
        else {
            if (!parametroConsulta) {
                parametroConsulta = '';
            }
            sql = "SELECT * FROM escolas WHERE esc_nome like $1";
            parametros = ['%' + parametroConsulta + '%'];
        }

        const { rows: registros, fields: campos } = await poolConexao.query(sql, parametros);
        let listaEscolas = [];
        for (const registro of registros) {
            const escola = new Escola(registro.esc_codigo, registro.esc_nome, registro.esc_tipo, registro.esc_rua, registro.esc_numero, registro.esc_bairro, registro.esc_cidade, registro.esc_cep, registro.esc_email, registro.esc_telefone);
            listaEscolas.push(escola);
        }
        return listaEscolas;
    }
}