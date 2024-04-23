import defRotas from "../modelo/defRota.js";
export default class defRotaDAO{

    constructor(){}

    async gravar(client,rotaModelo){
        console.log(JSON.stringify(rotaModelo)) 
        console.log((rotaModelo.mon_codigo))
        const sql = 'INSERT INTO Rotas (rot_nome, rot_km, rot_periodo, rot_tempoInicio, rot_tempoFinal, vei_codigo, mon_codigo) values ($1,$2,$3,$4,$5,$6,$7) RETURNING rot_codigo'
        const values = [rotaModelo.rot_nome,rotaModelo.rot_km,rotaModelo.rot_periodo,rotaModelo.rot_tempoInicio,rotaModelo.rot_tempoFinal,rotaModelo.vei_codigo,rotaModelo.mon_codigo]
        const retorno = await client.query(sql,values)
        rotaModelo.rot_codigo = retorno.rows[0].rot_codigo
    }
}