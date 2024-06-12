import motoristaDAO from "../persistencia/motoristaDAO.js"

export default class Motorista{
    #id;
    #nome;
    #cnh;
    #celular;

    constructor(id = 0, nome = '', cnh = '', celular = '') {
        this.#id = id;
        this.#nome = nome;
        this.#cnh = cnh;
        this.#celular = celular;
    }

    get id() {
        return this.#id;
    }

    set id(novoid) {
        this.#id = novoid;
    }

    get nome() {
        return this.#nome
    }

    set nome(novanome) {
        this.#nome = novanome
    }

    get cnh() {
        return this.#cnh;
    }

    set cnh(novocnh) {
        this.#cnh = novocnh;
    }

    get celular() {
        return this.#celular;
    }

    set celular(novocelular) {
        this.#celular = novocelular;
    }

    toJSON() {
        return {
            id: this.#id,
            nome: this.#nome,
            cnh: this.#cnh,
            celular: this.#celular
        }
    }

    

    async gravar(client){
        try{
        const motoristaDao = new motoristaDAO()
        await  motoristaDao.gravar(this,client)
        }catch(erro){
            throw erro
        }
    }

    async atualizar(client){
        const motoristaDao = new motoristaDAO()
        await motoristaDao.atualizar(this,client)
    }

    async deletar(client){
        const motoristaDao = new motoristaDAO()
        await motoristaDao.deletar(this.#id,client)
    }

    // o filtro pode ou nao conter valores, na classe motoristaDAO tem um if para analisar
    async buscar(client,filtro){
        try{
            const motoristaDao = new motoristaDAO()
            return await motoristaDao.consultar(client,filtro)
        }catch(erro){
            throw erro
        }
    }


}