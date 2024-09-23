import { Router } from "express";
import ContasPagarCtrl from "../controle/contasCtrl";

const contasPagarCtrl = ContasPagarCtrl.getInstance();
const rotaContas = new Router();

rotaContas.get('/', contasPagarCtrl.consultar)
    .post('/', contasPagarCtrl.gravar)
    .patch('/', contasPagarCtrl.atualizar)
    .put('/', contasPagarCtrl.atualizar)
    .delete('/', contasPagarCtrl.excluir);

export default rotaContas;