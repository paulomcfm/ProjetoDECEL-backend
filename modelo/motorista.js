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

    get Id(){
        return this.#id;
    }

    set Id(novoId){
        this.#id = novoId;
    }

    get Nome(){
        return this.#nome;
    }

    set Nome(novoNome){
        this.#nome = novoNome;
    }

    get Cnh(){
        return this.#cnh;
    }

    set Cnh(novoCnh){
        this.#cnh = novoCnh;
    }

    get celular(){
        return this.#celular;
    }

    set celular(novocelular){
        this.#celular = novocelular;
    }
    

    toJson(){
        return {
            id:this.#id,
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