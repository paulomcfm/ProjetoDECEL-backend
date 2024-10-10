import { ICalcularValor } from './icalcularvalor.js';
import Recebimento from './recebimento.js';
import Cartao from './cartao.js';

export default class AVista {

    constructor(){
        this.implements();
    }

    calcular(recebimento) {
        if (recebimento instanceof Recebimento) {
            if(recebimento.tipo === 'AVista'){
                return recebimento.valorMensalidade - (recebimento.valorMensalidade * 0.1);
            } else {
                const cartao = new Cartao();
                return cartao.calcular(recebimento);
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