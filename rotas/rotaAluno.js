import { Router } from 'express';
import AlunoCtrl from '../controle/alunoCtrl.js';

const aluCtrl = new AlunoCtrl();
const rotaAluno = new Router();

rotaAluno.get('/', aluCtrl.consultar)
    .get('/:termo', aluCtrl.consultar)
    .post('/', aluCtrl.gravar)
    .patch('/', aluCtrl.atualizar)
    .put('/', aluCtrl.atualizar)
    .delete('/', aluCtrl.excluir);

export default rotaAluno;