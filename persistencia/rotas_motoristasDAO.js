import Motorista from "../modelo/motorista.js"
export default class Rotas_MotoristasDAO{

    async gravar(client,modelo){
        try{
            let sql = 'INSERT INTO rotas_tem_motoristas(rot_codigo,moto_id) values ($1,$2)'
            let values = []
            for(const motorista of modelo.motoristas){
                values = [modelo.rota.codigo,motorista.id]
                await client.query(sql,values)
            }
        }catch(erro){
            throw erro
        }
    }
    
    async deletar(client,rotaCodigo){
        try{
            let sql = 'DELETE FROM rotas_tem_motoristas WHERE rot_codigo = $1'
            let values = [rotaCodigo]    
            await client.query(sql,values)
        }catch(erro){
            throw erro
        }
    }
    
    async consultar(client,rotaCodigo){
        try{
            let lista = []
            let sql = "SELECT * FROM ((SELECT * FROM rotas_tem_motoristas WHERE rot_codigo = $1) as rota INNER JOIN motoristas on motoristas.moto_id = rota.moto_id)"
            let values = [rotaCodigo]
            const { rows: registros, fields:campos } = await client.query(sql,values);
            for(const registro of registros){
                const motorista = new Motorista(registro.moto_id,registro.moto_nome,registro.moto_cnh,registro.moto_celular)
                lista.push(motorista)
            }
            return lista
        }catch(erro){
            throw erro
        }
    }
    
    



}