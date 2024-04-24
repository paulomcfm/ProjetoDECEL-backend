import defRotaDAO from "../persistencia/defRotaDAO.js"

export default class defRota{
    #codigo 
    #nome 
    #km 
    #periodo 
    #ida
    #volta 
    #veiculo 
    #monitor
    #pontos
    #motoristas 


    constructor(codigo, nome, km, periodo, tempoInicio, volta, veiculoCodigo, monitorCodigo,pontos,motoristas) {
        this.#codigo = codigo;
        this.#nome = nome;
        this.#km = km;
        this.#periodo = periodo;
        this.#ida= tempoInicio;
        this.#volta = volta;
        this.#veiculo = veiculoCodigo;
        this.#monitor = monitorCodigo;
        this.#pontos = pontos
        this.#motoristas = motoristas
    }

    get codigo() {
        return this.#codigo;
    }

    set codigo(codigo) {
        this.#codigo = codigo;
    }

    get nome() {
        return this.#nome;
    }

    set nome(nome) {
        this.#nome = nome;
    }

    get km() {
        return this.#km;
    }

    set km(km) {
        this.#km = km;
    }

    get periodo() {
        return this.#periodo;
    }

    set periodo(periodo) {
        this.#periodo = periodo;
    }

    get ida() {
        return this.#ida;
    }

    set ida(tempoInicio) {
        this.#ida= tempoInicio;
    }

    get volta() {
        return this.#volta;
    }

    set volta(volta) {
        this.#volta = volta;
    }

    get veiculo() {
        return this.#veiculo;
    }

    set veiculo(veiculoCodigo) {
        this.#veiculo = veiculoCodigo;
    }

    get monitor() {
        return this.#monitor;
    }

    set monitor(monitorCodigo) {
        this.#monitor = monitorCodigo;
    }

    get motoristas() {
        return this.#motoristas;
    }

    set motoristas(motoristasCodigo) {
        this.#motoristas = motoristasCodigo;
    }
    
    get pontos() {
        return this.#pontos;
    }

    set pontos(pontosCodigo) {
        this.#pontos = pontosCodigo;
    }

    toJSON() {
        return {
            codigo: this.#codigo,
            nome: this.#nome,
            km: this.#km,
            periodo: this.#periodo,
            tempoInicio: this.#ida,
            volta: this.#volta,
            veiculo: this.#veiculo,
            monitor: this.#monitor,
            motoristas:this.#motoristas,
            pontos:this.#pontos
        };
    }
    


    async gravar(client){
        const dao = new defRotaDAO()
        await dao.gravar(client,this)
    }

    async deletar(){

    }

    async atualizar(){

    }

    async consultar(client,termo){
        const dao = new defRotaDAO()
        return await dao.consultar(client,termo)
    }

    async gravarPontos(client){
        const dao = new defRotaDAO()
        await dao.gravarPontos(client,this)
    }

    async gravarMotoristas(client){
        const dao = new defRotaDAO()
        await dao.gravarMotoristas(client,this)
    }

    async consultarPontos(client){
        const dao = new defRotaDAO()
        await dao.consultarPontos(client,this)
    }

    async consultarMotoristas(client){
        const dao = new defRotaDAO()
        await dao.consultarMotoristas(client,this)
    }


}