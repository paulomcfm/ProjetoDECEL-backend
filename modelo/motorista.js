import motoristaDAO from "../persistencia/motoristaDAO.js"
export default class Motorista{
    #id;
    #nome;
    #cnh;
    #celular;

    constructor(id,nome,cnh,celular){
        this.#id = id;
        this.#nome = nome;
        this.#cnh = cnh;
        this.#celular = celular;
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

    getcelular(){
        return this.#celular;
    }

    setcelular(novoCelular){
        this.#celular = novoCelular;
    }
    

    toJson(){
        return {
            nome:this.#nome,
            cnh:this.#cnh,
            celular:this.#celular
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