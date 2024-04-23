import defRotas from "../modelo/defRota.js";
export default class defRotaDAO{

    constructor(){}

    async gravar(client,rotaModelo){
        console.log(JSON.stringify(rotaModelo)) 
        const sql = 'INSERT INTO Rotas (rot_nome, rot_km, rot_periodo, rot_tempoInicio, rot_tempoFinal, vei_codigo, mon_codigo) values ($1,$2,$3,$4,$5,$6,$7) RETURNING rot_codigo'
        const values = [rotaModelo.nome,rotaModelo.km,rotaModelo.periodo,rotaModelo.ida,rotaModelo.volta,rotaModelo.veiculo,rotaModelo.monitor]
        const retorno = await client.query(sql,values)
        rotaModelo.codigo = retorno.rows[0].rot_codigo
        console.log(rotaModelo.codigo)
    }

    async gravarPontos(client,rotaModelo){
        for(const ponto of rotaModelo.pontos){
            const sql = 'INSERT INTO rotas_tem_pontosdeembarque(rot_codigo,pde_codigo) values ($1,$2)'
            const values = [rotaModelo.codigo,ponto]
            await client.query(sql,values)
        }
    }
}