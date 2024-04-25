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

    get Telefone(){
        return this.#telefone;
    }

    set Telefone(novoTelefone){
        this.#telefone = novoTelefone;
    }
    

    toJson(){
        return {
            id:this.#id,
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