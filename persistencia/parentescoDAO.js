import Parentesco from "../modelo/parentesco.js";

export default class ParentescoDAO {
    async gravar(parentesco, client) {
        if (parentesco instanceof Parentesco) {
            const sql = "INSERT INTO parentescos(alu_codigo, resp_codigo, par_parentesco) VALUES($1,$2,$3)";
            const parametros = [parentesco.codigoAluno, parentesco.codigoResponsavel, parentesco.parentesco];
            
            await client.query(sql, parametros);
            
        }
    }

    async atualizar(parentesco, client) {
        if (parentesco instanceof Parentesco) {
            const sql = "UPDATE parentescos SET par_parentesco = $1 WHERE alu_codigo = $2 AND resp_codigo = $3";
            const parametros = [parentesco.parentesco, parentesco.codigoAluno, parentesco.codigoResponsavel];
            
            await client.query(sql, parametros);
            
        }
    }

    async excluir(parentesco, client) {
        if (parentesco instanceof Parentesco) {
            const sql = "DELETE FROM parentescos WHERE alu_codigo = $1 AND resp_codigo = $2";
            const parametros = [parentesco.codigoAluno, parentesco.codigoResponsavel];
            
            await client.query(sql, parametros);
            
        }
    }

    async consultar(parametroConsulta, client) {
        let sql = '';
        let parametros = [];
        if (!isNaN(parseInt(parametroConsulta[0])) && !isNaN(parseInt(parametroConsulta[1]))) {
            sql = 'SELECT * FROM parentescos WHERE alu_codigo = $1 AND resp_codigo = $2';
            parametros = [parametroConsulta];
        }
        else {
            sql = "SELECT * FROM parentescos";
            parametros = '';
        }
        const { rows: registros, fields: campos } = await client.query(sql, parametros);
        let listaParentescos = [];
        for (const registro of registros) {
            const parentesco = new Parentesco(registro.alu_codigo, registro.resp_codigo, registro.par_parentesco);
            listaParentescos.push(parentesco);
        }
        return listaParentescos;
    }

    async consultarAluno(parametroConsulta, client) {
        let sql = '';
        let parametros = [];
        if (!isNaN(parseInt(parametroConsulta))) {
            sql = 'SELECT * FROM parentescos WHERE alu_codigo = $1';
            parametros = [parametroConsulta];
        }
        
        const { rows: registros, fields: campos } = await client.query(sql, parametros);
        let listaParentescos = [];
        for (const registro of registros) {
            const parentesco = new Parentesco(registro.alu_codigo, registro.resp_codigo, registro.par_parentesco);
            listaParentescos.push(parentesco);
        }
        return listaParentescos;
    }

    async consultarResponsavel(parametroConsulta, client) {
        let sql = '';
        let parametros = [];
        if (!isNaN(parseInt(parametroConsulta))) {
            sql = 'SELECT * FROM parentescos WHERE resp_codigo = $1';
            parametros = [parametroConsulta];
        }
        
        const { rows: registros, fields: campos } = await client.query(sql, parametros);
        let listaParentescos = [];
        for (const registro of registros) {
            const parentesco = new Parentesco(registro.alu_codigo, registro.resp_codigo, registro.par_parentesco);
            listaParentescos.push(parentesco);
        }
        return listaParentescos;
    }
}