import { Router } from 'express';
import PontoEmbarqueCtrl from '../controle/pontoEmbarqueCtrl.js';

const pdeCtrl = PontoEmbarqueCtrl.getInstance();
const rotaPontoEmbarque = new Router();

rotaPontoEmbarque.get('/', pdeCtrl.consultar)
    .get('/:termo', pdeCtrl.consultar)
    .post('/', pdeCtrl.gravar)
    .patch('/', pdeCtrl.atualizar)
    .put('/', pdeCtrl.atualizar)
    .delete('/', pdeCtrl.excluir);

export default rotaPontoEmbarque;