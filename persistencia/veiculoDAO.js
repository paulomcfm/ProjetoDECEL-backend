import Responsavel from "../modelo/responsavel.js";
import Veiculo from "../modelo/veiculo.js";

export default class VeiculoDAO {
    async gravar(veiculo, client) {
        if (veiculo instanceof Veiculo) {
            const sql = "INSERT INTO veiculos(vei_renavam, vei_placa, vei_modelo, vei_capacidade, vei_tipo,status) VALUES($1,$2,$3,$4,$5,$6) RETURNING vei_codigo;";
            const parametros = [veiculo.renavam, veiculo.placa, veiculo.modelo, veiculo.capacidade, veiculo.tipo,true];
            
            const retorno = await client.query(sql, parametros);
            veiculo.codigo = retorno.rows[0].vei_codigo;
        }
    }

    async atualizar(veiculo, client) {
        if (veiculo instanceof Veiculo) {
            const sql = "UPDATE veiculos SET vei_renavam = $1, vei_placa = $2, vei_modelo = $3, vei_capacidade = $4, vei_tipo = $5 WHERE vei_codigo = $6";
            const parametros = [veiculo.renavam, veiculo.placa, veiculo.modelo, veiculo.capacidade, veiculo.tipo, veiculo.codigo];
            
            await client.query(sql, parametros);
            
        }
    }

    async excluir(veiculo, client) {
        if (veiculo instanceof Veiculo) {
            const sql = "DELETE FROM veiculos WHERE vei_codigo = $1";
            const parametros = [veiculo.codigo];
            
            await client.query(sql, parametros);
            
        }
    }

    async desativar(veiculo,client){
        try{
            if (veiculo instanceof Veiculo) {
                const sql = "UPDATE veiculos SET status = $1 WHERE vei_codigo = $2";
                const parametros = [false,veiculo.codigo];
                
                await client.query(sql, parametros);
                
            }
        }catch(erro){
            throw erro
        }
    }

    async consultarObservadores(parametroConsulta, client) {

        let sql = 'SELECT * FROM (SELECT responsaveis.* FROM responsaveis INNER JOIN (SELECT parentescos.* FROM parentescos\
                    INNER JOIN (SELECT alunos.* FROM alunos INNER JOIN (SELECT inscricoes.* FROM inscricoes INNER JOIN (SELECT *\
                    FROM rotas WHERE rotas.vei_codigo = $1) as rota ON rota.rot_codigo = inscricoes.rot_codigo) as rotaIns ON\
                    rotaIns.alu_codigo = alunos.alu_codigo) as alunoRot ON alunoRot.alu_codigo = parentescos.alu_codigo) as\
                    parent ON parent.resp_codigo = responsaveis.resp_codigo) as observers';
    
        
        let parametros = [parametroConsulta];
        
        
        const { rows: registros, fields: campos } = await client.query(sql, parametros);
        
        
        let listaObservadores = [];
        
        
        for (const registro of registros) {
            const resp = new Responsavel(
                registro.resp_codigo,
                registro.resp_nome,
                registro.resp_rg,
                registro.resp_cpf,
                registro.resp_email,
                registro.resp_telefone,
                registro.resp_celular,
                [] 
            );

            listaObservadores.push(resp);
        }
        return listaObservadores;
    }
    

    async consultar(parametroConsulta, client) {
        let sql = '';
        let parametros = [];
        if (!isNaN(parseInt(parametroConsulta))) {
            sql = 'SELECT * FROM veiculos WHERE vei_codigo = $1';
            parametros = [parametroConsulta];
        }
        else {
            if (!parametroConsulta) {
                parametroConsulta = '';
            }
            sql = "SELECT * FROM veiculos WHERE vei_renavam like $1 order by vei_renavam";
            parametros = ['%' + parametroConsulta + '%'];
        }
        
        const { rows: registros, fields: campos } = await client.query(sql, parametros);
    
        let listaVeiculos = [];
        for (const registro of registros) {
            const veiculo = new Veiculo(registro.vei_codigo, registro.vei_renavam, registro.vei_placa, registro.vei_modelo, registro.vei_capacidade, registro.vei_tipo);
            listaVeiculos.push(veiculo);
        }
        return listaVeiculos;
    }

    async consultarRota(veiCodigo, client) {
        const sql = 'SELECT status FROM Rotas WHERE vei_codigo = $1';
        const parametros = [veiCodigo];
        const { rows } = await client.query(sql, parametros);
        if (rows.length > 0) {
            return rows[0].status;
        }
        return null;
    }
}