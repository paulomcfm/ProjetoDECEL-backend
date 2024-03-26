import Responsavel from "../modelo/responsavel.js";
import conectar from "./conexao.js";

export default class ResponsavelDAO {
    async gravar(responsavel) {
        if (responsavel instanceof Responsavel) {
            const sql = "INSERT INTO responsaveis(resp_nome, resp_rg, resp_cpf, resp_email, resp_telefone, resp_celular) VALUES(?,?,?,?,?,?)";
            const parametros = [responsavel.nome, responsavel.rg, responsavel.cpf, responsavel.email, responsavel.telefone, responsavel.celular];
            const conexao = await conectar();
            const retorno = await conexao.query(sql, parametros);
            responsavel.codigo = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(responsavel) {
        if (responsavel instanceof Responsavel) {
            const sql = "UPDATE responsaveis SET resp_nome = ?, resp_rg = ?, resp_cpf = ?, resp_email = ?, resp_telefone = ?, resp_celular = ? WHERE resp_codigo = ?";
            const parametros = [responsavel.nome, responsavel.rg, responsavel.cpf, responsavel.email, responsavel.telefone, responsavel.celular, responsavel.codigo];
            const conexao = await conectar();
            await conexao.query(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(responsavel) {
        if (responsavel instanceof Responsavel) {
            const sql = "DELETE FROM responsaveis WHERE resp_codigo = ?";
            const parametros = [responsavel.codigo];
            const conexao = await conectar();
            await conexao.query(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(parametroConsulta) {
        let sql = '';
        let parametros = [];
        if (!isNaN(parseInt(parametroConsulta))) {
            sql = 'SELECT * FROM responsaveis WHERE resp_codigo = ? order by resp_nome';
            parametros = [parametroConsulta];
        }
        else {
            if (!parametroConsulta) {
                parametroConsulta = '';
            }
            sql = "SELECT * FROM responsaveis WHERE resp_nome like ?";
            parametros = ['%' + parametroConsulta + '%'];
        }
        const conexao = await conectar();
        const { rows: registros, fields: campos } = await client.query(sql, parametros);
        let listaResponsaveis = [];
        for (const registro of registros) {
            const responsavel = new Responsavel(registro.resp_codigo, registro.resp_nome, registro.resp_rg, registro.resp_cpf, registro.resp_email, registro.resp_telefone, registro.resp_celular);
            listaResponsaveis.push(responsavel);
        }
        return listaResponsaveis;
    }
}