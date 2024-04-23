import Inscricao from "../modelo/inscricao.js";
import PontoEmbarque from "../modelo/pontoEmbarque.js";
import Escola from "../modelo/escola.js";
import Aluno from "../modelo/aluno.js";
import poolConexao from "./conexao.js";

export default class InscricaoDAO {
    async gravar(inscricao) {
        if (inscricao instanceof Inscricao) {
            const sql = "INSERT INTO inscricoes(insc_ano, insc_anoLetivo, insc_etapa, insc_turma, insc_periodo, insc_rua, insc_numero, insc_bairro, insc_cep, pde_codigo, esc_codigo, alu_codigo) VALUES(DATE_PART('year', CURRENT_DATE), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);";
            const parametros = [inscricao.anoLetivo, inscricao.etapa, inscricao.turma, inscricao.periodo, inscricao.rua, inscricao.numero, inscricao.bairro, inscricao.cep, inscricao.pontoEmbarque.codigo, inscricao.escola.codigo, inscricao.aluno.codigo];
            const retorno = await poolConexao.query(sql, parametros);
        }
    }

    async atualizar(inscricao) {
        if (inscricao instanceof Inscricao) {
            const sql = "UPDATE inscricoes SET insc_anoLetivo = $1, insc_etapa = $2, insc_turma = $3, insc_periodo = $4, insc_rua = $5, insc_numero = $6, insc_bairro = $7, insc_cep = $8, pde_codigo = $9, esc_codigo = $10, alu_codigo = $11 WHERE insc_codigo = $12";
            const parametros = [inscricao.anoLetivo, inscricao.etapa, inscricao.turma, inscricao.periodo, inscricao.rua, inscricao.numero, inscricao.bairro, inscricao.cep, inscricao.pontoEmbarque.codigo, inscricao.escola.codigo, inscricao.aluno.codigo, inscricao.codigo];
            const retorno = await poolConexao.query(sql, parametros);
        }
    }

    async novaAtualizar(inscricao) {
        if (inscricao instanceof Inscricao) {
            const sql = "UPDATE inscricoes SET insc_anoLetivo = $1, insc_etapa = $2, insc_turma = $3, insc_periodo = $4, insc_rua = $5, insc_numero = $6, insc_bairro = $7, insc_cep = $8, pde_codigo = $9, esc_codigo = $10, insc_dataAlocacao = $11,  rot_codigo = $12 WHERE alu_codigo = $13 AND insc_ano = $14";
            const parametros = [inscricao.anoLetivo, inscricao.etapa, inscricao.turma, inscricao.periodo, inscricao.rua, inscricao.numero, inscricao.bairro, inscricao.cep, inscricao.pontoEmbarque.codigo, inscricao.escola.codigo, inscricao.dataAlocacao, inscricao.rota, inscricao.aluno.codigo, inscricao.ano];
            const retorno = await poolConexao.query(sql, parametros);
        }
    }

    async excluir(inscricao) {
        if (inscricao instanceof Inscricao) {
            const sql = "DELETE FROM inscricoes WHERE insc_codigo = $1";
            const parametros = [inscricao.codigo];
            const retorno = await poolConexao.query(sql, parametros);
        }
    }

    async consultar(parametroConsulta) {
        let sql = '';
        let parametros = [];
        const listaInscricoes = [];
        if (!parametroConsulta) {
            parametroConsulta = '';
        }
        if (parametroConsulta != '') {
            const sql = `SELECT i.insc_codigo,i.insc_ano,i.insc_anoletivo,i.insc_etapa,i.insc_turma,i.insc_periodo,i.insc_rua,i.insc_numero,i.insc_bairro,i.insc_cep,i.insc_dataAlocacao,
            pd.pde_rua,pd.pde_numero, pd.pde_bairro, pd.pde_cep,
            e.esc_nome,e.esc_tipo, e.esc_email, e.esc_telefone,
            a.alu_nome, a.alu_rg,a.alu_observacoes,a.alu_dataNasc,a.alu_celular,
			r.rot_nome, r.rot_km, r.rot_periodo, r.rot_tempoinicio, r.rot_tempofinal,
            i.pde_codigo, i.esc_codigo, i.alu_codigo, i.rot_codigo
            FROM inscricoes i
            INNER JOIN  pontosdeembarque pd ON i.pde_codigo = pd.pde_codigo
			LEFT JOIN  rotas r ON i.rot_codigo = r.rot_codigo
            INNER JOIN  escolas e ON i.esc_codigo = e.esc_codigo
            INNER JOIN  alunos a ON i.alu_codigo = a.alu_codigo
            WHERE a.alu_nome LIKE '$1'
            ORDER BY i.insc_ano DESC, a.alu_nome;;             
            `;
            parametros = ['%' + parametroConsulta + '%'];
            const { rows: registros, fields: campos } = await poolConexao.query(sql, parametros);
            for (const registro of registros) {
                const escola = new Escola(registro.esc_codigo, registro.esc_nome, registro.esc_tipo, registro.esc_email, registro.esc_telefone);
                const aluno = new Aluno(registro.alu_codigo, registro.alu_nome, registro.alu_rg, registro.alu_observacoes, registro.alu_datanasc, registro.alu_celular);
                const pontoEmbarque = new PontoEmbarque(registro.pde_codigo, registro.pde_rua, registro.pde_numero, registro.pde_bairro, registro.pde_cep);
                const inscricao = new Inscricao(registro.insc_codigo, aluno, pontoEmbarque, escola, null, registro.insc_ano, registro.insc_cep, registro.insc_rua, registro.insc_numero, registro.insc_bairro, registro.insc_periodo, registro.insc_etapa, registro.insc_anoletivo, registro.insc_turma, registro.insc_dataAlocacao);
                listaInscricoes.push(inscricao);
            }
        }
        else {
            sql = `SELECT i.insc_codigo,i.insc_ano,i.insc_anoletivo,i.insc_etapa,i.insc_turma,i.insc_periodo,i.insc_rua,i.insc_numero,i.insc_bairro,i.insc_cep,i.insc_dataAlocacao,
            pd.pde_rua,pd.pde_numero, pd.pde_bairro, pd.pde_cep,
            e.esc_nome,e.esc_tipo, e.esc_email, e.esc_telefone,
            a.alu_nome, a.alu_rg,a.alu_observacoes,a.alu_dataNasc,a.alu_celular,
			r.rot_nome, r.rot_km, r.rot_periodo, r.rot_tempoinicio, r.rot_tempofinal,
            i.pde_codigo, i.esc_codigo, i.alu_codigo, i.rot_codigo
            FROM inscricoes i
            INNER JOIN  pontosdeembarque pd ON i.pde_codigo = pd.pde_codigo
			LEFT JOIN  rotas r ON i.rot_codigo = r.rot_codigo
            INNER JOIN  escolas e ON i.esc_codigo = e.esc_codigo
            INNER JOIN  alunos a ON i.alu_codigo = a.alu_codigo
            ORDER BY i.insc_ano DESC, a.alu_nome;
            `;
            const { rows: registros, fields: campos } = await poolConexao.query(sql);
            for (const registro of registros) {
                const escola = new Escola(registro.esc_codigo, registro.esc_nome, registro.esc_tipo, registro.esc_email, registro.esc_telefone);
                const aluno = new Aluno(registro.alu_codigo, registro.alu_nome, registro.alu_rg, registro.alu_observacoes, registro.alu_datanasc, registro.alu_celular);
                const pontoEmbarque = new PontoEmbarque(registro.pde_codigo, registro.pde_rua, registro.pde_numero, registro.pde_bairro, registro.pde_cep);
                const inscricao = new Inscricao(registro.insc_codigo, aluno, pontoEmbarque, escola, null, registro.insc_ano, registro.insc_cep, registro.insc_rua, registro.insc_numero, registro.insc_bairro, registro.insc_periodo, registro.insc_etapa, registro.insc_anoletivo, registro.insc_turma, registro.insc_dataAlocacao);
                listaInscricoes.push(inscricao);
            }
        }
        return listaInscricoes;
    }

    async consultarPorRota(parametroConsulta) {
        let sql = '';
        let parametros = [];
        const listaInscricoes = [];
        sql = `SELECT i.insc_codigo,i.insc_ano,i.insc_anoletivo,i.insc_etapa,i.insc_turma,i.insc_periodo,i.insc_rua,i.insc_numero,i.insc_bairro,i.insc_cep,i.insc_dataAlocacao,
            pd.pde_rua,pd.pde_numero, pd.pde_bairro, pd.pde_cep,
            e.esc_nome,e.esc_tipo, e.esc_email, e.esc_telefone,
            a.alu_nome, a.alu_rg,a.alu_observacoes,a.alu_dataNasc,a.alu_celular,
            r.rot_nome, r.rot_km, r.rot_periodo, r.rot_tempoinicio, r.rot_tempofinal,
            i.pde_codigo, i.esc_codigo, i.alu_codigo, i.rot_codigo
            FROM inscricoes i
            INNER JOIN pontosdeembarque pd ON i.pde_codigo = pd.pde_codigo
            LEFT JOIN rotas r ON i.rot_codigo = r.rot_codigo
            INNER JOIN escolas e ON i.esc_codigo = e.esc_codigo
            INNER JOIN alunos a ON i.alu_codigo = a.alu_codigo
            WHERE i.rot_codigo = $1
            ORDER BY a.alu_nome;`;

        parametros = [parametroConsulta];
        const { rows: registros, fields: campos } = await poolConexao.query(sql, parametros);
        for (const registro of registros) {
            const escola = new Escola(registro.esc_codigo, registro.esc_nome, registro.esc_tipo, registro.esc_email, registro.esc_telefone);
            const aluno = new Aluno(registro.alu_codigo, registro.alu_nome, registro.alu_rg, registro.alu_observacoes, registro.alu_dataNasc, registro.alu_celular);
            const pontoEmbarque = new PontoEmbarque(registro.pde_codigo, registro.pde_rua, registro.pde_numero, registro.pde_bairro, registro.pde_cep);
            const inscricao = new Inscricao(registro.insc_codigo, aluno, pontoEmbarque, escola, registro.rot_codigo, registro.insc_ano, registro.insc_cep, registro.insc_rua, registro.insc_numero, registro.insc_bairro, registro.insc_periodo, registro.insc_etapa, registro.insc_anoletivo, registro.insc_turma, registro.insc_dataAlocacao);
            listaInscricoes.push(inscricao);
        }
        return listaInscricoes;
    }
}