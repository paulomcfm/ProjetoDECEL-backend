export default class ContasPagarCtrl{
    static _instance = null;

    constructor() {
        ContasPagarCtrl._instance = this;
    }

    static getInstance() {
        if (ContasPagarCtrl._instance == null)
            new ContasPagarCtrl();
        return ContasPagarCtrl._instance;
    }

    async gravar(requisicao, resposta){

    }

    async atualizar(requisicao, resposta){

    }

    async excluir(requisicao, resposta){

    }

    async consultar(requisicao, resposta){

    }
}