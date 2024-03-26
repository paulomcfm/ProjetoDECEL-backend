import { Router } from 'express';
import ParentescoCtrl from '../controle/parentescoCtrl.js';

const parCtrl = new ParentescoCtrl();
const rotaParentesco = new Router();

rotaParentesco.get('/', parCtrl.consultar)
    .get('/:termo', parCtrl.consultar)
    .get('/aluno/:termo', parCtrl.consultarAluno)
    .post('/', parCtrl.gravar)
    .patch('/', parCtrl.atualizar)
    .put('/', parCtrl.atualizar)
    .delete('/', parCtrl.excluir);

export default rotaParentesco;