import poolConexao from "./conexao.js";

export default class motoristaDAO{
    #conexao
    

    constructor(){
        this.#conexao = poolConexao;
    }

    async gravar(motorista){
        const sql = 'insert into motoristas(moto_nome,moto_cnh,moto_telefone) values ($1,$2,$3)'
        const values = [motorista.nome,motorista.cnh,motorista.telefone]
        await this.#conexao.query(sql,values)
    }

    async deletar(filtro){
        const sql = 'delete from motoristas where moto_id = $1'
        const values = [filtro]
        await this.#conexao.query(sql,values)
    }

    async consultar(filtro){
        let lista = []
        let linhas
        if(filtro === "" || filtro === undefined){
            const sql = 'select * from motoristas'
            await this.#conexao.query(sql).then((res)=>{
                linhas = res.rows
            })
        }else{
            const sql = `select * from motoristas where moto_nome ilike $1`;
            const values = [filtro + '%'];
            await this.#conexao.query(sql,values).then((res)=>{
                linhas = res.rows
            })
        }
        for(let i=0;i<linhas.length;i++){
            const motorista ={
                'id':linhas[i].moto_id,
                'nome':linhas[i].moto_nome,
                'cnh':linhas[i].moto_cnh,
                'telefone':linhas[i].moto_telefone
            }
            lista.push(motorista)
        }
        return lista
    }

    async atualizar(motorista){
        const sql = 'update motoristas set moto_nome=$1,moto_telefone=$2 where moto_cnh = $3'
        const values = [motorista.nome,motorista.telefone,motorista.cnh]
        await this.#conexao.query(sql,values)
    }



}