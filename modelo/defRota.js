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
    #inscricoes
    #status


    constructor(codigo, nome, km, periodo, tempoInicio, volta, veiculoCodigo, monitorCodigo,pontos,motoristas,inscricoes,status) {
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
        this.#inscricoes = inscricoes
        this.#status = status
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
    
    get inscricoes() {
        return this.#inscricoes;
    }

    set inscricoes(inscricoesCodigo) {
        this.#inscricoes = inscricoesCodigo;
    }
    
    get status() {
        return this.#status;
    }

    set status(novoStatus) {
        this.#status = novoStatus;
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
            pontos:this.#pontos,
            inscricoes:this.#inscricoes,
            status:this.#status
        };
    }
    


    async gravar(client){
        try{
            const dao = new defRotaDAO()
            await dao.gravar(client,this)
        }catch(erro){
            throw erro
        }
    }

    async deletar(client){
        try{
            const dao = new defRotaDAO()
            await dao.deletar(client,this)
        }catch(erro){
            throw erro
        }
    }

    async atualizar(client){
        try{
            const dao = new defRotaDAO()
            await dao.atualizar(client,this)
        }catch(erro){
            throw erro
        }
    }

    async consultar(client,termo){
        try{
            const dao = new defRotaDAO()
            return await dao.consultar(client,termo)
        }catch(erro){
            console.log(erro)
            throw erro
        }
    }

    async consultarQtdInscricoes(client){
        const dao = new defRotaDAO()
        return await dao.consultarQtdInscricoes(client,this)
    }

    async desativar(client){
        try{
            const dao = new defRotaDAO()
            return await dao.desativar(client,this.#codigo)
        }catch(erro){
            console.log(erro)
            throw erro
        }
    }


}