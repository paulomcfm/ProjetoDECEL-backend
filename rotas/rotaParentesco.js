import { Router } from 'express';
import ParentescoCtrl from '../controle/parentescoCtrl.js';

const rotaParentesco = new Router();

rotaParentesco.get('/', ParentescoCtrl.consultar)
    .get('/:termo', ParentescoCtrl.consultar)
    .get('/aluno/:termo', ParentescoCtrl.consultarAluno)
    .get('/responsavel/:termo', ParentescoCtrl.consultarResponsavel)
    .post('/', ParentescoCtrl.gravar)
    .patch('/', ParentescoCtrl.atualizar)
    .put('/', ParentescoCtrl.atualizar)
    .delete('/', ParentescoCtrl.excluir);

export default rotaParentesco;