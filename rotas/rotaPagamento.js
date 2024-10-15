import { Router } from 'express';
import PagamentoCtrl from '../controle/pagamentoCtrl.js';

const pagCtrl = PagamentoCtrl.getInstance();
const rotaPagamento = new Router();

rotaPagamento
    .post('/', pagCtrl.gravar);

export default rotaPagamento;