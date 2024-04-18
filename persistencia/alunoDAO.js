import Aluno from "../modelo/aluno.js";
import poolConexao from "./conexao.js";


export default class AlunoDAO {
    async gravar(aluno) {
        if (aluno instanceof Aluno) {
            const sql = "INSERT INTO alunos(alu_nome, alu_rg, alu_observacoes, alu_dataNasc, alu_celular) VALUES($1,$2,$3,$4,$5) RETURNING alu_codigo;";
            const parametros = [aluno.nome, aluno.rg, aluno.observacoes, aluno.dataNasc, aluno.celular];
            
            const retorno = await poolConexao.query(sql, parametros);
            aluno.codigo = retorno.rows[0].alu_codigo;
        }
    }

    async atualizar(aluno) {
        if (aluno instanceof Aluno) {
            const sql = "UPDATE alunos SET alu_nome = $1, alu_rg = $2, alu_observacoes = $3, alu_dataNasc = $4, alu_celular = $5 WHERE alu_codigo = $6";
            const parametros = [aluno.nome, aluno.rg, aluno.observacoes, aluno.dataNasc, aluno.celular, aluno.codigo];
            
            await poolConexao.query(sql, parametros);
            
        }
    }

    async excluir(aluno) {
        if (aluno instanceof Aluno) {
            const sql = "DELETE FROM alunos WHERE alu_codigo = $1";
            const parametros = [aluno.codigo];
            
            await poolConexao.query(sql, parametros);
            
        }
    }

    async consultar(parametroConsulta) {
        let sql = '';
        let parametros = [];
        if (!isNaN(parseInt(parametroConsulta))) {
            sql = 'SELECT * FROM alunos WHERE alu_codigo = $1 order by alu_nome';
            parametros = [parametroConsulta];
        }
        else {
            if (!parametroConsulta) {
                parametroConsulta = '';
            }
            sql = "SELECT * FROM alunos WHERE alu_nome like $1 order by alu_nome";
            parametros = ['%' + parametroConsulta + '%'];
        }
        
        const { rows: registros, fields: campos } = await poolConexao.query(sql, parametros);
        let listaAlunos = [];
        for (const registro of registros) {
            const aluno = new Aluno(registro.alu_codigo, registro.alu_nome, registro.alu_rg, registro.alu_observacoes, registro.alu_datanasc, registro.alu_celular);
            listaAlunos.push(aluno);
        }
        return listaAlunos;
    }
}