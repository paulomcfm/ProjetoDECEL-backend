import { Router } from 'express';
import AlunoCtrl from '../controle/alunoCtrl.js';

// const aluCtrl = new AlunoCtrl();
const rotaAluno = new Router();

rotaAluno.get('/', AlunoCtrl.consultar)
    .get('/:termo', AlunoCtrl.consultar)
    .post('/', AlunoCtrl.gravar)
    .patch('/', AlunoCtrl.atualizar)
    .put('/', AlunoCtrl.atualizar)
    .delete('/', AlunoCtrl.excluir);

export default rotaAluno;