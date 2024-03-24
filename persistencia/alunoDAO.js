import Aluno from "../modelo/aluno.js";
import conectar from "./conexao.js";

export default class AlunoDAO {
    async gravar(aluno) {
        if (aluno instanceof Aluno) {
            const sql = "INSERT INTO alunos(alu_nome, alu_rg, alu_observacoes, alu_dataNasc) VALUES(?,?,?,?)";
            const parametros = [aluno.nome, aluno.rg, aluno.observacoes, aluno.dataNasc];
            const conexao = await conectar();
            const retorno = await conexao.execute(sql, parametros);
            aluno.codigo = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(aluno) {
        if (aluno instanceof Aluno) {
            const sql = "UPDATE alunos SET alu_nome = ?, alu_rg = ?, alu_observacoes = ?, alu_dataNasc = ? WHERE alu_codigo = ?";
            const parametros = [aluno.nome, aluno.rg, aluno.observacoes, aluno.dataNasc, aluno.codigo];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(aluno) {
        if (aluno instanceof Aluno) {
            const sql = "DELETE FROM alunos WHERE alu_codigo = ?";
            const parametros = [aluno.codigo];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
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
        const conexao = await conectar();
        const [registros, campos] = await conexao.execute(sql, parametros);
        let listaAlunos = [];
        for (const registro of registros) {
            const aluno = new Aluno(registro.alu_codigo, registro.alu_nome, registro.alu_rg, registro.alu_observacoes, registro.alu_datanasc);
            listaAlunos.push(aluno);
        }
        return listaAlunos;
    }
}