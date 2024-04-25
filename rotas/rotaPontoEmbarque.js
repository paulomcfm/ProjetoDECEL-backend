import { Router } from 'express';
import PontoEmbarqueCtrl from '../controle/pontoEmbarqueCtrl.js';

//const pdeCtrl = new PontoEmbarqueCtrl();
const rotaPontoEmbarque = new Router();

rotaPontoEmbarque.get('/', PontoEmbarqueCtrl.consultar)
    .get('/:termo', PontoEmbarqueCtrl.consultar)
    .post('/', PontoEmbarqueCtrl.gravar)
    .patch('/', PontoEmbarqueCtrl.atualizar)
    .put('/', PontoEmbarqueCtrl.atualizar)
    .delete('/', PontoEmbarqueCtrl.excluir);

export default rotaPontoEmbarque;