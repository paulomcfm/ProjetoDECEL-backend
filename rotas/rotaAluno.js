import { Router } from 'express';
import AlunoCtrl from '../controle/alunoCtrl.js';

const aluCtrl = AlunoCtrl.getInstance();
const rotaAluno = new Router();

rotaAluno.get('/', aluCtrl.consultar)
    .get('/:termo', aluCtrl.consultar)
    .post('/', aluCtrl.gravar)
    .patch('/', aluCtrl.atualizar)
    .put('/', aluCtrl.atualizar)
    .delete('/', aluCtrl.excluir);

export default rotaAluno;