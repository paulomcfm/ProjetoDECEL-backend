import { Router } from 'express';
import InscricaoCtrl from '../controle/inscricaoCtrl.js';

// const inscCtrl = new InscricaoCtrl();
const rotaInscricaoAluno = new Router();

rotaInscricaoAluno.get('/', InscricaoCtrl.consultar)
    .get('/:termo', InscricaoCtrl.consultar)
    .post('/', InscricaoCtrl.gravar)
    .patch('/', InscricaoCtrl.atualizar)
    .put('/', InscricaoCtrl.atualizar)
    .delete('/', InscricaoCtrl.excluir)
    .put('/atualizar-inscricoes', InscricaoCtrl.atualizarInscricoes);
export default rotaInscricaoAluno;