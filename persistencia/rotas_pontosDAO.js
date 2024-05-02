import PontoEmbarque from "../modelo/pontoEmbarque.js";
export default class Rotas_PontosDAO{

    constructor(){}


    async gravar(client,modelo){
        try{
            let sql = 'INSERT INTO rotas_tem_pontosdeembarque(rot_codigo,pde_codigo,ordem) values ($1,$2,$3)'
            let values = []
            let ordem=0
            for(const reg of modelo.pontos){
                ordem++;
                values = [modelo.rota.codigo,reg.codigo,''+ordem]
                await client.query(sql,values)
            }
        }catch(erro){
            throw erro
        }
    }
    
    async deletar(client,rotaCodigo){
        try{
            let sql = 'DELETE FROM rotas_tem_pontosdeembarque WHERE rot_codigo = $1'
            let values = [rotaCodigo]
            await client.query(sql,values)
        }catch(erro){
            throw erro
        }
    }
    
    async consultar(client,modelo){
        try{
            let sql = 'SELECT * FROM rotas_tem_pontosdeembarque WHERE rot_codigo = $1'
            let values = [modelo.rota.codigo]
            const { rows: registros, fields:campos } = await client.query(sql,values)
            
            return registros
        }catch(erro){
            throw erro
        }
    }

    async consultarPontos(client,rotaCodigo){
        try{
            let lista = []
            let sql = "SELECT * FROM rotas_tem_pontosdeembarque INNER JOIN pontosdeembarque ON pontosdeembarque.pde_codigo = rotas_tem_pontosdeembarque.pde_codigo where rot_codigo = $1 order by ordem asc "
            let values = [rotaCodigo]
            const { rows: registros, fields:campos } = await client.query(sql,values)
            for(const registro of registros){
                const ponto = new PontoEmbarque(registro.pde_codigo,registro.pde_rua,registro.pde_numero,registro.pde_bairro,registro.pde_cep)
                lista.push(ponto)
            }
            return lista
        }catch(erro){
            throw erro
        }
    }







}