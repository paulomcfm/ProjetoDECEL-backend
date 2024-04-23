import { Router } from 'express';
import InscricaoCtrl from '../controle/inscricaoCtrl.js';

const inscCtrl = new InscricaoCtrl();
const rotaInscricaoAluno = new Router();

rotaInscricaoAluno.get('/', inscCtrl.consultar)
    .get('/:termo', inscCtrl.consultar)
    .post('/', inscCtrl.gravar)
    .patch('/', inscCtrl.atualizar)
    .put('/', inscCtrl.atualizar)
    .delete('/', inscCtrl.excluir)
    .put('/atualizar-inscricoes', inscCtrl.atualizarInscricoes);
export default rotaInscricaoAluno;