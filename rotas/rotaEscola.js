import { Router } from 'express';
import EscolaCtrl from '../controle/escolaCtrl.js';

const escCtrl = EscolaCtrl.getInstance();
const rotaEscola = new Router();

rotaEscola.get('/', escCtrl.consultar)
    .get('/:termo', escCtrl.consultar)
    .post('/', escCtrl.gravar)
    .patch('/', escCtrl.atualizar)
    .put('/', escCtrl.atualizar)
    .delete('/', escCtrl.excluir);

export default rotaEscola;