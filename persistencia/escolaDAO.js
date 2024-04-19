import Escola from "../modelo/escola.js";
import PontoEmbarque from "../modelo/pontoEmbarque.js";
import poolConexao from "./conexao.js";

export default class EscolaDAO {
    async gravar(escola) {
        if (escola instanceof Escola) {
            const sql = "INSERT INTO escolas(esc_nome, esc_tipo, esc_email, esc_telefone, esc_pde_codigo) VALUES($1,$2,$3,$4,$5)";
            const parametros = [escola.nome, escola.tipo, escola.email, escola.telefone, escola.pontoEmbarque.codigo];
            const retorno = await poolConexao.query(sql, parametros);
        }
    }

    async atualizar(escola) {
        if (escola instanceof Escola) {
            const sql = "UPDATE escolas SET esc_nome = $1, esc_tipo = $2, esc_email = $3, esc_telefone = $4, esc_pde_codigo = $5 WHERE esc_codigo = $6";
            const parametros = [escola.nome, escola.tipo, escola.email, escola.telefone, escola.pontoEmbarque.codigo, escola.codigo];
            const retorno = await poolConexao.query(sql, parametros);  
        }
    }

    async excluir(escola) {
        if (escola instanceof Escola) {
            const sql = "DELETE FROM escolas WHERE esc_codigo = $1";
            const parametros = [escola.codigo];
            const retorno = await poolConexao.query(sql, parametros);
        }
    }

    async consultar(parametroConsulta) {
        let sql = '';
        let parametros = [];
        const listaEscolas = [];
        if (!isNaN(parseInt(parametroConsulta))){
            const sql = `SELECT esc.esc_codigo, esc.esc_nome, esc.esc_tipo, esc.esc_email, esc.esc_telefone,
            pde.pde_codigo, pde.pde_rua, pde.pde_numero, pde.pde_bairro, pde.pde_cep
             FROM escolas esc 
            INNER JOIN pontos_de_embarque pde ON esc.esc_pde_codigo = pde.pde_codigo
            WHERE pde.pde_nome like $1
            ORDER BY esc.esc_nome               
            `;
            parametros = [parametroConsulta];
            const { rows: registros, fields: campos } = await poolConexao.query(sql, parametros);
            for (const registro of registros){
                const pontoEmbarque = new PontoEmbarque(registro.pde_codigo,registro.pde_rua, registro.pde_numero, registro.pde_bairro, registro.pde_cep);
                const escola = new Escola(registro.esc_codigo, registro.esc_nome, registro.esc_tipo, registro.esc_email, registro.esc_telefone, pontoEmbarque);
                listaEscolas.push(escola);
            }
        }
        else {
            if (!parametroConsulta) {
                parametroConsulta = '';
            }
            sql = `SELECT esc.esc_codigo, esc.esc_nome, esc.esc_tipo, esc.esc_email, esc.esc_telefone,
            pde.pde_codigo, pde.pde_rua, pde.pde_numero, pde.pde_bairro, pde.pde_cep
             FROM escolas esc 
            INNER JOIN pontos_de_embarque pde ON esc.esc_pde_codigo = pde.pde_codigo
            WHERE esc.esc_nome like $1
            ORDER BY esc.esc_nome  
            `;
            parametros = ['%' + parametroConsulta + '%'];
            const { rows: registros, fields: campos } = await poolConexao.query(sql, parametros);
            for (const registro of registros) {
                const pontoEmbarque = new PontoEmbarque(registro.pde_codigo,registro.pde_rua, registro.pde_numero, registro.pde_bairro, registro.pde_cep);
                const escola = new Escola(registro.esc_codigo, registro.esc_nome, registro.esc_tipo, registro.esc_email, registro.esc_telefone, pontoEmbarque);
                listaEscolas.push(escola);
            }
        }
        return listaEscolas;        
    }
}