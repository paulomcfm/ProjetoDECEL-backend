import defRota from "../modelo/defRota.js";
import pontoEmbarque from '../modelo/pontoEmbarque.js'
import motorista from '../modelo/motorista.js'
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
        for(const ponto of rotaModelo.pontos){
            sql = 'INSERT INTO rotas_tem_pontosdeembarque(rot_codigo,pde_codigo) values ($1,$2)'
            values = [rotaModelo.codigo,ponto]
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
        let sql = "SELECT * FROM rotas_tem_pontosdeembarque INNER JOIN pontosdeembarque ON pontosdeembarque.pde_codigo = rotas_tem_pontosdeembarque.pde_codigo where rot_codigo = $1 "
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
}