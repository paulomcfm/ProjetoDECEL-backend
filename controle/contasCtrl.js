export default class ContasCtrl {
    static _instance = null;

    constructor() {
        ContasCtrl._instance = this;
    }

    static getInstance() {
        if (ContasCtrl._instance == null)
            new ContasCtrl();
        return ContasCtrl._instance;
    }

    gravarConta(recebimento) {
        console.log("Chamando gravarConta em ContasCtrl");
        this.verificaStatusCaixa();
        this.atualizaCaixa(recebimento);
    }

    verificaStatusCaixa() {
        console.log("Verificando o status do caixa...");
        return true;
    }

    atualizaCaixa() {
        throw new Error("Método abstrato: atualizaCaixa() precisa ser implementado pela subclasse.");
    }
}