import { Router } from 'express';
import ResponsavelCtrl from '../controle/responsavelCtrl.js';

const respCtrl = ResponsavelCtrl.getInstance();
const rotaResponsavel = new Router();

rotaResponsavel.get('/', respCtrl.consultar)
    .get('/:termo', respCtrl.consultar)
    .post('/', respCtrl.gravar)
    .patch('/', respCtrl.atualizar)
    .put('/', respCtrl.atualizar)
    .delete('/', respCtrl.excluir);

export default rotaResponsavel;