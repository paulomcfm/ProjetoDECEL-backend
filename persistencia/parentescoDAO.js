import Parentesco from "../modelo/parentesco.js";
import Aluno from "../modelo/aluno.js";
import Responsavel from "../modelo/responsavel.js";

export default class ParentescoDAO {
    async gravar(parentesco, client) {
        if (parentesco instanceof Parentesco) {
            const sql = "INSERT INTO parentescos(alu_codigo, resp_codigo, par_parentesco) VALUES($1,$2,$3)";
            const parametros = [parentesco.aluno.codigo, parentesco.responsavel.codigo, parentesco.parentesco];
            
            await client.query(sql, parametros);
            
        }
    }

    async atualizar(parentesco, client) {
        if (parentesco instanceof Parentesco) {
            const sql = "UPDATE parentescos SET par_parentesco = $1 WHERE alu_codigo = $2 AND resp_codigo = $3";
            const parametros = [parentesco.parentesco, parentesco.aluno.codigo, parentesco.responsavel.codigo];
            
            await client.query(sql, parametros);
            
        }
    }

    async excluir(parentesco, client) {
        if (parentesco instanceof Parentesco) {
            const sql = "DELETE FROM parentescos WHERE alu_codigo = $1 AND resp_codigo = $2";
            const parametros = [parentesco.aluno.codigo, parentesco.responsavel.codigo];
            
            await client.query(sql, parametros);
            
        }
    }

    async consultarAluno(parametroConsulta, client) {
        let sql = '';
        let parametros = [];
        if (!isNaN(parseInt(parametroConsulta))) {
            sql = 'SELECT a.*, r.*, p.par_parentesco FROM parentescos p JOIN alunos a ON p.alu_codigo = a.alu_codigo JOIN responsaveis r ON p.resp_codigo = r.resp_codigo WHERE p.alu_codigo = $1';
            parametros = [parametroConsulta];
        }
        
        const { rows: registros, fields: campos } = await client.query(sql, parametros);
        let listaParentescos = [];
        for (const registro of registros) {
            const aluno = new Aluno(registro.alu_codigo, registro.alu_nome, registro.alu_rg, registro.alu_observacoes, registro.alu_datanasc, registro.alu_celular, null, registro.alu_status, registro.alu_motivoinativo);
            const responsavel = new Responsavel(registro.resp_codigo, registro.resp_nome, registro.resp_rg, registro.resp_cpf, registro.resp_email, registro.resp_telefone, registro.resp_celular, null);
            const parentesco = new Parentesco(aluno, responsavel, registro.par_parentesco);
            listaParentescos.push(parentesco);
        }
        return listaParentescos;
    }

    async consultarResponsavel(parametroConsulta, client) {
        let sql = '';
        let parametros = [];
        if (!isNaN(parseInt(parametroConsulta))) {
            sql = `
                SELECT a.*, r.*, p.par_parentesco 
                FROM parentescos p 
                JOIN alunos a ON p.alu_codigo = a.alu_codigo 
                JOIN responsaveis r ON p.resp_codigo = r.resp_codigo 
                WHERE p.resp_codigo = $1
            `;
            parametros = [parametroConsulta];
        }
        
        const { rows: registros } = await client.query(sql, parametros);
        let listaParentescos = [];
        for (const registro of registros) {
            const aluno = new Aluno(registro.alu_codigo, registro.alu_nome, registro.alu_rg, registro.alu_observacoes, registro.alu_datanasc, registro.alu_celular, null, registro.alu_status, registro.alu_motivoinativo);
            const responsavel = new Responsavel(registro.resp_codigo, registro.resp_nome, registro.resp_rg, registro.resp_cpf, registro.resp_email, registro.resp_telefone, registro.resp_celular, null);
            const parentesco = new Parentesco(aluno, responsavel, registro.par_parentesco);
            listaParentescos.push(parentesco);
        }
        return listaParentescos;
    }
}