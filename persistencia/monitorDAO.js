import Monitor from "../modelo/monitor.js"

export default class MonitorDAO{
     
    async gravar(client,monitor){
        try{
            let sql = 'INSERT INTO monitores(mon_nome,mon_cpf,mon_celular) values ($1,$2,$3)'
            let values = [monitor.nome,monitor.cpf,monitor.celular]
            await client.query(sql,values)
        }catch(erro){
            throw erro
        }
     }

     async atualizar(client,monitor){
        try{
            let sql = 'UPDATE monitores SET mon_nome = $2,mon_cpf=$3,mon_celular=$4 WHERE mon_codigo = $1'
            let values = [monitor.codigo,monitor.nome,monitor.cpf,monitor.celular]
            await client.query(sql,values)
        }catch(erro){
            throw erro
        }
     }

     async excluir(client,termo){
        try{
            let sql = 'DELETE FROM monitores WHERE mon_codigo = $1'
            let values = [termo]
            await client.query(sql,values)
        }catch(erro){
            throw erro
        }
     }

     async consultar(client,termo){
        try{
            let sql = ''
            let values = []
            if(termo == ''){
                sql = 'SELECT * FROM monitores'
            }
            else{
                sql = 'SELECT * FROM monitores WHERE mon_nome ilike $1'
                values = [termo]
            }

            const {rows:registros,fields:campos} = await client.query(sql,values)
            let lista = []
            for(const registro of registros){
                lista.push(new Monitor(registro.mon_codigo,registro.mon_nome,registro.mon_cpf,registro.mon_celular))
            }
            return lista
        }catch(erro){

        }
     }

     
}