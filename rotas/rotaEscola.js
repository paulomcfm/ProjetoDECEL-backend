import { Router } from 'express';
import EscolaCtrl from '../controle/escolaCtrl.js';

//const escCtrl = new EscolaCtrl();
const rotaEscola = new Router();

rotaEscola.get('/', EscolaCtrl.consultar)
    .get('/:termo', EscolaCtrl.consultar)
    .post('/', EscolaCtrl.gravar)
    .patch('/', EscolaCtrl.atualizar)
    .put('/', EscolaCtrl.atualizar)
    .delete('/', EscolaCtrl.excluir);

export default rotaEscola;