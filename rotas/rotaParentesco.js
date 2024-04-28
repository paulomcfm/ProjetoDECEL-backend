import { Router } from 'express';
import ParentescoCtrl from '../controle/parentescoCtrl.js';

const parCtrl = ParentescoCtrl.getInstance();
const rotaParentesco = new Router();

rotaParentesco
    .get('/aluno/:termo', parCtrl.consultarAluno)
    .get('/responsavel/:termo', parCtrl.consultarResponsavel)

export default rotaParentesco;