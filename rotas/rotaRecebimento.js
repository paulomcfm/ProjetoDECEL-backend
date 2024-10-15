import { Router } from 'express';
import RecebimentoCtrl from '../controle/recebimentoCtrl.js';

const recCtrl = RecebimentoCtrl.getInstance();
const rotaRecebimento = new Router();

rotaRecebimento
    .post('/', recCtrl.gravar);

export default rotaRecebimento;