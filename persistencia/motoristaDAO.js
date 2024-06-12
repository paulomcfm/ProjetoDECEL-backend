import poolConexao from "./conexao.js";

export default class motoristaDAO{
    #conexao

    async gravar(motorista,client){
        try{
        const sql = 'insert into motoristas(moto_nome,moto_cnh,moto_celular) values ($1,$2,$3)'
        const values = [motorista.nome,motorista.cnh,motorista.celular]
        await client.query(sql,values)
        }catch(erro){
            throw erro
        }
    }

    async deletar(filtro,client){
        const sql = 'delete from motoristas where moto_id = $1'
        const values = [filtro]
        await client.query(sql,values)
    }

    async consultar(client,filtro){
        try{
            let sql
            let values = []
            let lista = []
            let linhas
            if(filtro === "" || filtro === undefined){
                sql = 'select * from motoristas'
            }else{
                sql = `select * from motoristas where moto_nome ilike $1`;
                values = [filtro + '%'];
            }
            
            await client.query(sql,values).then((res)=>{
                linhas = res.rows
            })
            for(let i=0;i<linhas.length;i++){
                const motorista ={
                    'id':linhas[i].moto_id,
                    'nome':linhas[i].moto_nome,
                    'cnh':linhas[i].moto_cnh,
                    'celular':linhas[i].moto_celular
                }
                lista.push(motorista)
            }
            return lista
        }catch(erro){
            throw erro
        }
    }

    async atualizar(motorista,client){
        const sql = 'update motoristas set moto_nome=$1,moto_celular=$2 where moto_cnh = $3'
        const values = [motorista.nome,motorista.celular,motorista.cnh]
        await client.query(sql,values)
    }



}