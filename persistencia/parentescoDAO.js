import Parentesco from "../modelo/parentesco.js";
import poolConexao from "./conexao.js";

export default class ParentescoDAO {
    async gravar(parentesco) {
        if (parentesco instanceof Parentesco) {
            const sql = "INSERT INTO parentescos(alu_codigo, resp_codigo, par_parentesco) VALUES(?,?,?)";
            const parametros = [parentesco.codigoAluno, parentesco.codigoResponsavel, parentesco.parentesco];
            
            await poolConexao.query(sql, parametros);
            
        }
    }

    async atualizar(parentesco) {
        if (parentesco instanceof Parentesco) {
            const sql = "UPDATE parentescos SET par_parentesco = ? WHERE alu_codigo = ? AND resp_codigo = ?";
            const parametros = [parentesco.parentesco, parentesco.codigoAluno, parentesco.codigoResponsavel];
            
            await poolConexao.query(sql, parametros);
            
        }
    }

    async excluir(parentesco) {
        if (parentesco instanceof Parentesco) {
            const sql = "DELETE FROM parentescos WHERE alu_codigo = ? AND resp_codigo = ?";
            const parametros = [parentesco.codigoAluno, parentesco.codigoResponsavel];
            
            await poolConexao.query(sql, parametros);
            
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
            sql = "SELECT * FROM parentescos";
            parametros = '';
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

    async consultarAluno(parametroConsulta) {
        let sql = '';
        let parametros = [];
        if (!isNaN(parseInt(parametroConsulta))) {
            sql = 'SELECT * FROM parentescos WHERE alu_codigo = ?';
            parametros = [parametroConsulta];
        }
        
        const { rows: registros, fields: campos } = await poolConexao.query(sql, parametros);
        let listaParentescos = [];
        for (const registro of registros) {
            const parentesco = new Parentesco(registro.alu_codigo, registro.resp_codigo, registro.par_parentesco);
            listaParentescos.push(parentesco);
        }
        return listaParentescos;
    }
}