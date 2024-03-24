import { Router } from 'express';
import ResponsavelCtrl from '../controle/responsavelCtrl.js';

const respCtrl = new ResponsavelCtrl();
const rotaResponsavel = new Router();

rotaResponsavel.get('/', respCtrl.consultar)
    .get('/:termo', respCtrl.consultar)
    .post('/', respCtrl.gravar)
    .patch('/', respCtrl.atualizar)
    .put('/', respCtrl.atualizar)
    .delete('/', respCtrl.excluir);

export default rotaResponsavel;