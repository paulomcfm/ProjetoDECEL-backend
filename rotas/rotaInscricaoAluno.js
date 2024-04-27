import { Router } from 'express';
import InscricaoCtrl from '../controle/inscricaoCtrl.js';

const inscCtrl = InscricaoCtrl.getInstance();
const rotaInscricaoAluno = new Router();

rotaInscricaoAluno.get('/', inscCtrl.consultar)
    .get('/:termo', inscCtrl.consultar)
    .post('/', inscCtrl.gravar)
    .patch('/', inscCtrl.atualizar)
    .put('/', inscCtrl.atualizar)
    .delete('/', inscCtrl.excluir)
export default rotaInscricaoAluno;