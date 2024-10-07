import ICalcularValor from './icalcularvalor';

export default class Cartao {

    constructor(){
        this.implements();
    }

    calcular(recebimento) {
        if (recebimento instanceof Recebimento) {
            if(reccebimento.tipo === 'Cartao'){
                return recebimento.valorRecebimento;
            }else{
                parcelado = new Parcelado(recebimento);
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