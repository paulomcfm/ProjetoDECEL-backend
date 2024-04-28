import { Router } from 'express';
import AlocarCtrl from '../controle/alocarCtrl.js';

const alocCtrl = AlocarCtrl.getInstance();
const rotaAlocarAlunos = new Router();

rotaAlocarAlunos
    .put('/atualizar-inscricoes', alocCtrl.atualizarInscricoes);
export default rotaAlocarAlunos;