import Parentesco from "../modelo/parentesco.js";
import conectar from "./conexao.js";

export default class ParentescoDAO {
    async gravar(parentesco) {
        if (parentesco instanceof Parentesco) {
            const sql = "INSERT INTO parentescos(alu_codigo, resp_codigo, par_parentesco) VALUES(?,?,?)";
            const parametros = [parentesco.codigoAluno, parentesco.codigoResponsavel, parentesco.parentesco];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(parentesco) {
        if (parentesco instanceof Parentesco) {
            const sql = "UPDATE parentescos SET par_parentesco = ? WHERE alu_codigo = ? AND resp_codigo = ?";
            const parametros = [parentesco.parentesco, parentesco.codigoAluno, parentesco.codigoResponsavel];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(parentesco) {
        if (parentesco instanceof Parentesco) {
            const sql = "DELETE FROM parentescos WHERE alu_codigo = ? AND resp_codigo = ?";
            const parametros = [parentesco.codigoAluno, parentesco.codigoResponsavel];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(parametroConsulta) {
        let sql = '';
        let parametros = [];
        if (!isNaN(parseInt(parametroConsulta[0])) && !isNaN(parseInt(parametroConsulta[1]))) {
            sql = 'SELECT * FROM parentescos WHERE alu_codigo = ? AND resp_codigo = ?';
            parametros = [parametroConsulta];
        }
        else {
            if (!parametroConsulta) {
                parametroConsulta = '';
            }
            sql = "SELECT * FROM parentescos WHERE par_parentesco like ?";
            parametros = ['%' + parametroConsulta + '%'];
        }
        const conexao = await conectar();
        const [registros, campos] = await conexao.execute(sql, parametros);
        let listaParentescos = [];
        for (const registro of registros) {
            const parentesco = new Parentesco(registro.alu_codigo, registro.resp_codigo, registro.par_parentesco);
            listaParentescos.push(parentesco);
        }
        return listaParentescos;
    }
}