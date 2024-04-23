import defRotaDAO from "../persistencia/defRotaDAO.js"

export default class defRota{
    #rot_codigo 
    #rot_nome 
    #rot_km 
    #rot_periodo 
    #rot_tempoInicio 
    #rot_tempoFinal 
    #vei_codigo 
    #mon_codigo 


    constructor(codigo, nome, km, periodo, tempoInicio, tempoFinal, veiculoCodigo, monitorCodigo) {
        this.#rot_codigo = codigo;
        this.#rot_nome = nome;
        this.#rot_km = km;
        this.#rot_periodo = periodo;
        this.#rot_tempoInicio = tempoInicio;
        this.#rot_tempoFinal = tempoFinal;
        this.#vei_codigo = veiculoCodigo;
        this.#mon_codigo = monitorCodigo;
    }

    get rot_codigo() {
        return this.#rot_codigo;
    }

    set rot_codigo(codigo) {
        this.#rot_codigo = codigo;
    }

    get rot_nome() {
        return this.#rot_nome;
    }

    set rot_nome(nome) {
        this.#rot_nome = nome;
    }

    get rot_km() {
        return this.#rot_km;
    }

    set rot_km(km) {
        this.#rot_km = km;
    }

    get rot_periodo() {
        return this.#rot_periodo;
    }

    set rot_periodo(periodo) {
        this.#rot_periodo = periodo;
    }

    get rot_tempoInicio() {
        return this.#rot_tempoInicio;
    }

    set rot_tempoInicio(tempoInicio) {
        this.#rot_tempoInicio = tempoInicio;
    }

    get rot_tempoFinal() {
        return this.#rot_tempoFinal;
    }

    set rot_tempoFinal(tempoFinal) {
        this.#rot_tempoFinal = tempoFinal;
    }

    get vei_codigo() {
        return this.#vei_codigo;
    }

    set vei_codigo(veiculoCodigo) {
        this.#vei_codigo = veiculoCodigo;
    }

    get mon_codigo() {
        return this.#mon_codigo;
    }

    set mon_codigo(monitorCodigo) {
        this.#mon_codigo = monitorCodigo;
    }

    toJSON() {
        return {
            rot_codigo: this.#rot_codigo,
            rot_nome: this.#rot_nome,
            rot_km: this.#rot_km,
            rot_periodo: this.#rot_periodo,
            rot_tempoInicio: this.#rot_tempoInicio,
            rot_tempoFinal: this.#rot_tempoFinal,
            vei_codigo: this.#vei_codigo,
            mon_codigo: this.#mon_codigo
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

    async consultar(){
        
    }


}