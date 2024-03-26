import Responsavel from "../modelo/responsavel.js";
import poolConexao from "./conexao.js";

export default class ResponsavelDAO {
    async gravar(responsavel) {
        if (responsavel instanceof Responsavel) {
            const sql = "INSERT INTO responsaveis(resp_nome, resp_rg, resp_cpf, resp_email, resp_telefone, resp_celular) VALUES($1,$2,$3,$4,$5,$6)";
            const parametros = [responsavel.nome, responsavel.rg, responsavel.cpf, responsavel.email, responsavel.telefone, responsavel.celular];
            await poolConexao.query(sql, parametros);
        }
    }

    async atualizar(responsavel) {
        if (responsavel instanceof Responsavel) {
            const sql = "UPDATE responsaveis SET resp_nome = $1, resp_rg = $2, resp_cpf = $3, resp_email = $4, resp_telefone = $5, resp_celular = $6 WHERE resp_codigo = $7";
            const parametros = [responsavel.nome, responsavel.rg, responsavel.cpf, responsavel.email, responsavel.telefone, responsavel.celular, responsavel.codigo];
            await poolConexao.query(sql, parametros);
        }
    }

    async excluir(responsavel) {
        if (responsavel instanceof Responsavel) {
            const sql = "DELETE FROM responsaveis WHERE resp_codigo = $1";
            const parametros = [responsavel.codigo];
            await poolConexao.query(sql, parametros);
        }
    }

    async consultar(parametroConsulta) {
        let sql = '';
        let parametros = [];
        if (!isNaN(parseInt(parametroConsulta))) {
            sql = 'SELECT * FROM responsaveis WHERE resp_codigo = $1 order by resp_nome';
            parametros = [parametroConsulta];
        }
        else {
            if (!parametroConsulta) {
                parametroConsulta = '';
            }
            sql = "SELECT * FROM responsaveis WHERE resp_nome like $1";
            parametros = ['%' + parametroConsulta + '%'];
        }
        const { rows: registros, fields: campos } = await poolConexao.query(sql, parametros);
        let listaResponsaveis = [];
        for (const registro of registros) {
            const responsavel = new Responsavel(registro.resp_codigo, registro.resp_nome, registro.resp_rg, registro.resp_cpf, registro.resp_email, registro.resp_telefone, registro.resp_celular);
            listaResponsaveis.push(responsavel);
        }
        return listaResponsaveis;
    }
}