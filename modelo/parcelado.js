import ICalcularValor from './icalcularvalor';

export default class Parcelado {

    constructor() {
        this.implements();
    }

    calcular(recebimento) {
        if (recebimento instanceof Recebimento) {
            return recebimento.valorRecebimento / recebimento.qtdParcelas * 1.05;
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