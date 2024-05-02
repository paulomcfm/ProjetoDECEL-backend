import defRota from "../modelo/defRota.js";
import pontoEmbarque from '../modelo/pontoEmbarque.js'
import motorista from '../modelo/motorista.js'
import inscricao from '../modelo/inscricao.js'
import Aluno from "../modelo/aluno.js";
export default class defRotaDAO{

    constructor(){}

    async gravar(client,rotaModelo){
        const sql = 'INSERT INTO Rotas (rot_nome, rot_km, rot_periodo, rot_tempoInicio, rot_tempoFinal, vei_codigo, mon_codigo) values ($1,$2,$3,$4,$5,$6,$7) RETURNING rot_codigo'
        const values = [rotaModelo.nome,rotaModelo.km,rotaModelo.periodo,rotaModelo.ida,rotaModelo.volta,rotaModelo.veiculo,rotaModelo.monitor]
        const retorno = await client.query(sql,values)
        rotaModelo.codigo = retorno.rows[0].rot_codigo
    }

    async gravarPontos(client,rotaModelo){
        let sql = ''
        let values = []
        let ordem=0
        for(const ponto of rotaModelo.pontos){
            ordem++;
            sql = 'INSERT INTO rotas_tem_pontosdeembarque(rot_codigo,pde_codigo,ordem) values ($1,$2,$3)'
            values = [rotaModelo.codigo,ponto,''+ordem]
            await client.query(sql,values)
        }
    }

    async gravarMotoristas(client,rotaModelo){
        let sql = ''
        let values = []
        for(const motorista of rotaModelo.motoristas){
            sql = 'INSERT INTO rotas_tem_motoristas(rot_codigo,moto_id) values ($1,$2)'
            values = [rotaModelo.codigo,motorista]
            await client.query(sql,values)
        }
    }

    async consultar(client,termo){
        let linhas = []
        let lista = []
        let sql;
        let values
        if(termo === ''){
             sql = 'SELECT * FROM rotas'
        }else{
            sql = 'SELECT * FROM rotas WHERE rot_nome ilike $1'
            values = ['%'+termo+'%']
        }

        const { rows: registros, fields: campos } = await client.query(sql,values)

        for(const registro of registros){
            sql = 'SELECT * FROM veiculos WHERE vei_codigo = $1'
            values = [registro.vei_codigo]
            const { rows: veiculo, fields: camposV } = await client.query(sql,values)
            sql = 'SELECT * FROM monitores WHERE mon_codigo = $1'
            values = [registro.mon_codigo]
            const { rows: monitor, fields: camposM } = await client.query(sql,values)
            const rota = new defRota(registro.rot_codigo,registro.rot_nome,registro.rot_km,registro.rot_periodo,registro.rot_tempoinicio,registro.rot_tempofinal,veiculo,monitor,[],[])
            lista.push(rota)
        }
        return lista
    }

    async consultarPontos(client,rotaModelo){
        let lista = []
        let sql = "SELECT * FROM rotas_tem_pontosdeembarque INNER JOIN pontosdeembarque ON pontosdeembarque.pde_codigo = rotas_tem_pontosdeembarque.pde_codigo where rot_codigo = $1 order by ordem asc "
        let values = [rotaModelo.codigo]
        const { rows: registros, fields: campos } = await client.query(sql,values)
        for(const registro of registros){
            const ponto = new pontoEmbarque(registro.pde_codigo,registro.pde_rua,registro.pde_numero,registro.pde_bairro,registro.pde_cep)
            lista.push(ponto)
        }
        rotaModelo.pontos = lista
    }

    async consultarMotoristas(client,rotaModelo){
        let lista = []
        let sql = "SELECT * FROM ((SELECT * FROM rotas_tem_motoristas WHERE rot_codigo = $1) as rota INNER JOIN motoristas on motoristas.moto_id = rota.moto_id)"
        let values = [rotaModelo.codigo]
        const { rows: registros, fields: campos } = await client.query(sql,values)
        for(const registro of registros){
            const moto = new motorista(registro.moto_id,registro.moto_nome,registro.moto_cnh,registro.moto_celular)
            lista.push(moto.toJson())
        }
        rotaModelo.motoristas = lista
    }


    async consultarQtdInscricoes(client,rotaModelo){
        let sql = "select count(rot_codigo) as qtd from inscricoes where rot_codigo = $1 Group by rot_codigo;"
        let values = [rotaModelo.codigo]
        const { rows: registros, fields: campos } = await client.query(sql,values)
        return registros
    }


    async consultarInscricoes(client,rotaModelo){
        let lista = []
        let sql = "SELECT * FROM inscricoes WHERE inscricoes.rot_codigo = $1"
        let values = [rotaModelo.codigo]
        const { rows: registros, fields: campos } = await client.query(sql,values)
        for(const registro of registros){
            sql = 'SELECT * FROM alunos WHERE alu_codigo = $1'
            values = [registro.alu_codigo]
            const { rows: registroA, fields: camposA } = await client.query(sql,values)
            sql = 'SELECT * FROM pontosdeembarque WHERE pde_codigo = $1'
            values = [registro.pde_codigo]
            const { rows: registroP, fields: camposP } = await client.query(sql,values)
            sql = 'SELECT * FROM escolas WHERE esc_codigo = $1'
            values = [registro.esc_codigo]
            const { rows: registroE, fields: camposE } = await client.query(sql,values)
            const inscricoes = new inscricao(registro.insc_ano,{codigo:registroA[0].alu_codigo,nome:registroA[0].alu_nome,rg:registroA[0].alu_rg,observacoes:registroA[0].alu_observacoes,dataNasc:registroA[0].alu_datanasc,celular:registroA[0].alu_celular},{ponto_codigo:registroP[0].pde_codigo,ponto_cep:registroP[0].pde_cep,ponto_numero:registroP[0].pde_numero},{escola_codigo:registroE[0].esc_codigo,escola_nome:registroE[0].esc_nome,escola_tipo:registroE[0].esc_tipo},[],registro.insc_cep,registro.insc_rua,registro.insc_numero,registro.insc_bairro,registro.insc_periodo,registro.insc_etapa,registro.insc_anoletivo,registro.insc_turma,registro.insc_dataalocacao)
            lista.push(inscricoes)
        }
        rotaModelo.inscricoes = lista
    }


    async atualizar(client,rotaModelo){
        try{
            let sql = "UPDATE rotas SET rot_nome=$2,rot_km=$3,rot_periodo=$4,rot_tempoInicio=$5,rot_tempoFinal=$6,vei_codigo=$7,mon_codigo=$8 WHERE rot_codigo = $1"
            let values = [rotaModelo.codigo,rotaModelo.nome,rotaModelo.km,rotaModelo.periodo,rotaModelo.ida,rotaModelo.volta,rotaModelo.veiculo,rotaModelo.monitor]
            await client.query(sql,values)
            sql = "DELETE FROM rotas_tem_motoristas WHERE rot_codigo = $1"
            values = [rotaModelo.codigo]
            
            await client.query(sql,values)
            for(let i=0;i<rotaModelo.motoristas.length;i++){
                sql = "INSERT INTO rotas_tem_motoristas(rot_codigo,moto_id) values ($1,$2)"
                values = [rotaModelo.codigo,rotaModelo.motoristas[i]]
                await client.query(sql,values)
            }

            sql = "DELETE FROM rotas_tem_pontosdeembarque WHERE rot_codigo = $1"
            values = [rotaModelo.codigo]
            await client.query(sql,values)
            let ordem = 0
            for(let i=0;i<rotaModelo.pontos.length;i++){
                ordem++;
                sql = "INSERT INTO rotas_tem_pontosdeembarque(rot_codigo,pde_codigo,ordem) values ($1,$2,$3)"
                values = [rotaModelo.codigo,rotaModelo.pontos[i],ordem]
                await client.query(sql,values)
            }
        }catch(erro){
            console.error("Ocorreu um erro durante a atualização:", erro);
            await client.query('ROLLBACK');
            throw erro
        }
    }

    async deletar(client,rotaModelo){
        try{
            let sql = 'DELETE FROM rotas_tem_motoristas WHERE rot_codigo = $1'
            let values = [rotaModelo.codigo]
            await client.query(sql,values)
            sql = 'DELETE FROM rotas_tem_pontosdeembarque WHERE rot_codigo = $1'
            await client.query(sql,values)
            sql = 'DELETE FROM rotas WHERE rot_codigo = $1'
            await client.query(sql,values)
        }catch(erro){
            await client.query('ROLLBACK')
            throw erro
        }
    }

}