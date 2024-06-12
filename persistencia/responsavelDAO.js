import Responsavel from "../modelo/responsavel.js";

export default class ResponsavelDAO {
    async gravar(responsavel,client) {
        if (responsavel instanceof Responsavel) {
            const sql = "INSERT INTO responsaveis(resp_nome, resp_rg, resp_cpf, resp_email, resp_telefone, resp_celular) VALUES($1,$2,$3,$4,$5,$6) RETURNING resp_codigo";
            const parametros = [responsavel.nome, responsavel.rg, responsavel.cpf, responsavel.email, responsavel.telefone, responsavel.celular];
            
            const retorno = await client.query(sql, parametros);
            responsavel.codigo = retorno.rows[0].resp_codigo;
        }
    }

    async atualizar(responsavel,client) {
        try{
            if (responsavel instanceof Responsavel) {
                const sql = "UPDATE responsaveis SET resp_nome = $1, resp_rg = $2, resp_cpf = $3, resp_email = $4, resp_telefone = $5, resp_celular = $6 WHERE resp_codigo = $7";
                const parametros = [responsavel.nome, responsavel.rg, responsavel.cpf, responsavel.email, responsavel.telefone, responsavel.celular, responsavel.codigo];
                await client.query(sql, parametros);
            }
        }catch(e){
            console.log(e)
        }
    }

    async excluir(responsavel,client) {
        if (responsavel instanceof Responsavel) {
            const sql = "DELETE FROM responsaveis WHERE resp_codigo = $1";
            const parametros = [responsavel.codigo];
            await client.query(sql, parametros);
        }
    }

    async consultar(parametroConsulta, client) {
        let sql = '';
        let parametros = [];
        if (!isNaN(parseInt(parametroConsulta))) {
            sql = `SELECT alunos.*, responsaveis.*
            FROM responsaveis
            LEFT JOIN parentescos ON responsaveis.resp_codigo = parentescos.resp_codigo
            LEFT JOIN alunos ON parentescos.alu_codigo = alunos.alu_codigo
            WHERE responsaveis.resp_codigo = $1
            ORDER BY responsaveis.resp_nome, alunos.alu_nome;`;
            parametros = [parametroConsulta];
        } else {
            if (!parametroConsulta) {
                parametroConsulta = '';
            }
            sql = `SELECT alunos.*, responsaveis.*
            FROM responsaveis
            LEFT JOIN parentescos ON responsaveis.resp_codigo = parentescos.resp_codigo
            LEFT JOIN alunos ON parentescos.alu_codigo = alunos.alu_codigo
            ORDER BY responsaveis.resp_nome, alunos.alu_nome;`;
        }
    
        const { rows: registros, fields: campos } = await client.query(sql, parametros);
        let listaResponsaveis = [];
        let responsavelAtual = null;
        for (const registro of registros) {
            if (!responsavelAtual || responsavelAtual.codigo !== registro.resp_codigo) {
                if (responsavelAtual) {
                    listaResponsaveis.push(responsavelAtual);
                }
                responsavelAtual = {
                    codigo: registro.resp_codigo,
                    nome: registro.resp_nome,
                    rg: registro.resp_rg,
                    cpf: registro.resp_cpf,
                    email: registro.resp_email,
                    telefone: registro.resp_telefone,
                    celular: registro.resp_celular,
                    alunos: []
                };
            }
            const aluno = {
                codigo: registro.alu_codigo,
                nome: registro.alu_nome,
                rg: registro.alu_rg,
                observacoes: registro.alu_observacoes,
                dataNasc: registro.alu_datanasc,
                celular: registro.alu_celular,
                status: registro.alu_status,
                motivoInativo: registro.alu_motivoinativo
            };
            if (registro.resp_codigo !== null) {
                responsavelAtual.alunos.push(aluno);
            }
        }
        if (responsavelAtual) {
            listaResponsaveis.push(responsavelAtual);
        }
        return listaResponsaveis;
    }
    
}