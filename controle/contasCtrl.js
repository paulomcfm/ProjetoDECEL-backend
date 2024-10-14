import Contas from "../modelo/contas.js";
import poolConexao from "../persistencia/conexao.js";

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

    gravarConta() {
        this.verificaStatusCaixa();
        this.atualizaCaixa();
    }

    verificaStatusCaixa() {
        // Implementação padrão: retorna status do caixa
        console.log("Verificando o status do caixa...");
        return true; // Exemplo de retorno
    }

    atualizaCaixa() {
        throw new Error("Método abstrato: atualizaCaixa() precisa ser implementado pela subclasse.");
    }
}