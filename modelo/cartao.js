import { ICalcularValor } from './icalcularvalor.js';
import Recebimento from './recebimento.js';
import Parcelado from './parcelado.js';

export default class Cartao {

    constructor(){
        this.implements();
    }

    calcular(recebimento) {
        if (recebimento instanceof Recebimento) {
            if(recebimento.tipo === 'Cartao'){
                return recebimento.valorMensalidade;
            }else{
                const parcelado = new Parcelado();
                return parcelado.calcular(recebimento);
            }
        }
    }

    implements() {
        // Função para verificar se todos os métodos de ICalcularValor foram implementados
        for (const method in ICalcularValor) {
            if (typeof this[method] !== 'function') {
                throw new Error(`A classe que implementa a interface ICalcularValor deve implementar o método ${method}`);
            }
        }
    }
}