import Aluno from "../modelo/aluno.js";

export default class AlunoDAO {
    async gravar(aluno, client) {
        if (aluno instanceof Aluno) {
            const sql = "INSERT INTO alunos(alu_nome, alu_rg, alu_observacoes, alu_dataNasc, alu_celular) VALUES($1,$2,$3,$4,$5) RETURNING alu_codigo;";
            const parametros = [aluno.nome, aluno.rg, aluno.observacoes, aluno.dataNasc, aluno.celular];
            
            const retorno = await client.query(sql, parametros);
            aluno.codigo = retorno.rows[0].alu_codigo;
        }
    }

    async atualizar(aluno, client) {
        if (aluno instanceof Aluno) {
            const sql = "UPDATE alunos SET alu_nome = $1, alu_rg = $2, alu_observacoes = $3, alu_dataNasc = $4, alu_celular = $5 WHERE alu_codigo = $6";
            const parametros = [aluno.nome, aluno.rg, aluno.observacoes, aluno.dataNasc, aluno.celular, aluno.codigo];
            
            await client.query(sql, parametros);
            
        }
    }

    async excluir(aluno, client) {
        if (aluno instanceof Aluno) {
            const sql = "DELETE FROM alunos WHERE alu_codigo = $1";
            const parametros = [aluno.codigo];
            
            await client.query(sql, parametros);
            
        }
    }

    async consultar(parametroConsulta, client) {
        let sql = '';
        let parametros = [];
        if (!isNaN(parseInt(parametroConsulta))) {
            sql = `SELECT alunos.*, responsaveis.*
                FROM alunos
                LEFT JOIN parentescos ON alunos.alu_codigo = parentescos.alu_codigo
                LEFT JOIN responsaveis ON parentescos.resp_codigo = responsaveis.resp_codigo
                WHERE alunos.alu_codigo = $1
                ORDER BY alunos.alu_nome, responsaveis.resp_nome;`;
            parametros = [parametroConsulta];
        } else {
            if (!parametroConsulta) {
                parametroConsulta = '';
            }
            sql = `SELECT alunos.*, responsaveis.*
                FROM alunos
                LEFT JOIN parentescos ON alunos.alu_codigo = parentescos.alu_codigo
                LEFT JOIN responsaveis ON parentescos.resp_codigo = responsaveis.resp_codigo
                WHERE alunos.alu_nome ILIKE  $1
                ORDER BY alunos.alu_nome, responsaveis.resp_nome;`;
            parametros = ['%' + parametroConsulta + '%'];
        }
    
        const { rows: registros, fields: campos } = await client.query(sql, parametros);
        let listaAlunos = [];
        let alunoAtual = null;
        for (const registro of registros) {
            if (!alunoAtual || alunoAtual.codigo !== registro.alu_codigo) {
                if (alunoAtual) {
                    listaAlunos.push(alunoAtual);
                }
                alunoAtual = {
                    codigo: registro.alu_codigo,
                    nome: registro.alu_nome,
                    rg: registro.alu_rg,
                    observacoes: registro.alu_observacoes,
                    dataNasc: registro.alu_datanasc,
                    celular: registro.alu_celular,
                    responsaveis: []
                };
            }
            const responsavel = {
                codigo: registro.resp_codigo,
                nome: registro.resp_nome,
                rg: registro.resp_rg,
                cpf: registro.resp_cpf,
                email: registro.resp_email,
                telefone: registro.resp_telefone,
                celular: registro.resp_celular
            };
            alunoAtual.responsaveis.push(responsavel);
        }
        if (alunoAtual) {
            listaAlunos.push(alunoAtual);
        }
        return listaAlunos;
    }
    
}