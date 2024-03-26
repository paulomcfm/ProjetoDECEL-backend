import Aluno from "../modelo/aluno.js";
import poolConexao from "./conexao.js";


export default class AlunoDAO {
    async gravar(aluno) {
        if (aluno instanceof Aluno) {
            const sql = "INSERT INTO alunos(alu_nome, alu_rg, alu_observacoes, alu_dataNasc) VALUES(?,?,?,?)";
            const parametros = [aluno.nome, aluno.rg, aluno.observacoes, aluno.dataNasc];
            
            const retorno = await poolConexao.query(sql, parametros);
        }
    }

    async atualizar(aluno) {
        if (aluno instanceof Aluno) {
            const sql = "UPDATE alunos SET alu_nome = ?, alu_rg = ?, alu_observacoes = ?, alu_dataNasc = ? WHERE alu_codigo = ?";
            const parametros = [aluno.nome, aluno.rg, aluno.observacoes, aluno.dataNasc, aluno.codigo];
            
            await poolConexao.query(sql, parametros);
            
        }
    }

    async excluir(aluno) {
        if (aluno instanceof Aluno) {
            const sql = "DELETE FROM alunos WHERE alu_codigo = ?";
            const parametros = [aluno.codigo];
            
            await poolConexao.query(sql, parametros);
            
        }
    }

    async consultar(parametroConsulta) {
        let sql = '';
        let parametros = [];
        if (!isNaN(parseInt(parametroConsulta))) {
            sql = 'SELECT * FROM alunos WHERE alu_codigo = ? order by alu_nome';
            parametros = [parametroConsulta];
        }
        else {
            if (!parametroConsulta) {
                parametroConsulta = '';
            }
            sql = "SELECT * FROM alunos WHERE alu_nome like ?";
            parametros = ['%' + parametroConsulta + '%'];
        }
        
        const { rows: registros, fields: campos } = await poolConexao.query(sql, parametros);
        let listaAlunos = [];
        for (const registro of registros) {
            const aluno = new Aluno(registro.alu_codigo, registro.alu_nome, registro.alu_rg, registro.alu_observacoes, registro.alu_datanasc);
            listaAlunos.push(aluno);
        }
        return listaAlunos;
    }
}