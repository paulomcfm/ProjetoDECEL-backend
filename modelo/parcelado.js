import { ICalcularValor } from './icalcularvalor.js';
import Recebimento from './recebimento.js';

export default class Parcelado {

    constructor() {
        this.implements();
    }

    calcular(recebimento) {
        if (recebimento instanceof Recebimento) {
            return recebimento.valorMensalidade / recebimento.qtdParcelas * 1.05;
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