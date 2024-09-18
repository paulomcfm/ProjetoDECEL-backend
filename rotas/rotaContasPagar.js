import { Router } from "express";
import ContasPagarCtrl from "../controle/contasPagarCtrl";

const contasPagarCtrl = ContasPagarCtrl.getInstance();
const rotaContasPagar = new Router();

rotaContasPagar.get('/', contasPagarCtrl.consultar)
    .post('/', contasPagarCtrl.gravar)
    .patch('/', contasPagarCtrl.atualizar)
    .put('/', contasPagarCtrl.atualizar)
    .delete('/', contasPagarCtrl.excluir);

export default rotaContasPagar;