import motoristaDAO from "../persistencia/motoristaDAO.js"
export default class Motorista{
    #id;
    #nome;
    #cnh;
    #telefone;

    constructor(id,nome,cnh,telefone){
        this.#id = id;
        this.#nome = nome;
        this.#cnh = cnh;
        this.#telefone = telefone;
    }

    getId(){
        return this.#id;
    }

    setId(novoId){
        this.#id = novoId;
    }

    getNome(){
        return this.#nome;
    }

    setNome(novoNome){
        this.#nome = novoNome;
    }

    getCnh(){
        return this.#cnh;
    }

    setCnh(novoCnh){
        this.#cnh = novoCnh;
    }

    getTelefone(){
        return this.#telefone;
    }

    setTelefone(novoTelefone){
        this.#telefone = novoTelefone;
    }
    

    toJson(){
        return {
            nome:this.#nome,
            cnh:this.#cnh,
            telefone:this.#telefone
        } 
    }

    async gravar(){
        const motoristaDao = new motoristaDAO()
        await  motoristaDao.gravar(this.toJson())
    }

    async atualizar(){
        const motoristaDao = new motoristaDAO()
        await motoristaDao.atualizar(this.toJson())
    }

    async deletar(){
        const motoristaDao = new motoristaDAO()
        await motoristaDao.deletar(this.#id)
    }

    // o filtro pode ou nao conter valores, na classe motoristaDAO tem um if para analisar
    async buscar(filtro){
        const motoristaDao = new motoristaDAO()
        return await motoristaDao.consultar(filtro)
    }


}