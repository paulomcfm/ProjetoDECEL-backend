import ICalcularValor from './icalcularvalor';

export default class AVista {

    constructor(){
        this.implements();
    }

    calcular(recebimento) {
        if (recebimento instanceof Recebimento) {
            if(reccebimento.tipo === 'AVista'){
                return recebimento.valorRecebimento-(recebimento.valorRecebimento*0.1);
            }else{
                cartao = new Cartao(recebimento);
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