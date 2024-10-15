import VeiculoDAO from "../persistencia/veiculoDAO.js";
import InterfaceSubject from "./interfaceSubject.js";

export default class Veiculo extends InterfaceSubject{
    #codigo;
    #renavam;
    #placa;
    #modelo;
    #capacidade;
    #tipo;
    #status
    #listaObservadores

    async registerObserver(observer,client){
        await observer.gravar(client)
    }

    async removeObserver(){
        await observer.excluir(client)
    }

    async notifyObserver(client){
        try{
            this.#listaObservadores = await new VeiculoDAO().consultarObservadores(this.#codigo,client);
            for(let observador of this.#listaObservadores){
                let rotas = await new VeiculoDAO().consultarRotaResponsavel(client,observador.codigo,this.#codigo)
                observador.update(rotas)
            }
        }catch(erro){
            throw erro
        }
    }

    constructor(codigo = 0, renavam = '', placa = '', modelo = '', capacidade = '', tipo = '',status = true) {
        super()
        this.#codigo = codigo;
        this.#renavam = renavam;
        this.#placa = placa;
        this.#modelo = modelo;
        this.#capacidade = capacidade;
        this.#tipo = tipo;
        this.#status = status
    }

    get codigo() {
        return this.#codigo;
    }

    set codigo(novoCodigo) {
        this.#codigo = novoCodigo;
    }

    get renavam() {
        return this.#renavam;
    }

    set renavam(novoRenavam) {
        this.#renavam = novoRenavam;
    }

    get placa() {
        return this.#placa;
    }

    set placa(novaPlaca) {
        this.#placa = novaPlaca;
    }

    get modelo() {
        return this.#modelo;
    }

    set modelo(novoModelo) {
        this.#modelo = novoModelo;
    }

    get capacidade() {
        return this.#capacidade;
    }

    set capacidade(novaCapacidade) {
        this.#capacidade = novaCapacidade;
    }

    get tipo() {
        return this.#tipo;
    }

    set tipo(novoTipo) {
        this.#tipo = novoTipo;
    }
    
    toJSON() {
        return {
            codigo: this.#codigo,
            renavam: this.#renavam,
            placa: this.#placa,
            modelo: this.#modelo,
            capacidade: this.#capacidade,
            tipo: this.#tipo
        }
    }

    async gravar(client) {
        const veiDAO = new VeiculoDAO();
        await veiDAO.gravar(this, client);
    }

    async excluir(client) {
        const veiDAO = new VeiculoDAO();
        await veiDAO.excluir(this, client);
    }

    async atualizar(client) {
        const veiDAO = new VeiculoDAO();
        await veiDAO.atualizar(this, client);
    }

    async desativarVeiculo(client){
        try{
            const veiDAO = new VeiculoDAO();
            await veiDAO.desativar(this, client);
            await this.notifyObserver(client)
        }catch(erro){
            throw erro
        }
    }

    async consultar(parametro, client) {
        const veiDAO = new VeiculoDAO();
        return await veiDAO.consultar(parametro, client);
    }

    async consultarRota(parametro, client) {
        const veiDAO = new VeiculoDAO();
        return await veiDAO.consultarRota(parametro, client);
    }
}