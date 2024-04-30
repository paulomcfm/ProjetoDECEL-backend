import { Router } from 'express';
import defRotaCtrl from '../controle/defRotaCtrl.js';

const deffRotaCtrl = defRotaCtrl.getInstance();
const rotaDefRota = new Router();

rotaDefRota
.get('/',deffRotaCtrl.consultar)
.get('/:termo',deffRotaCtrl.consultar)
.post('/', deffRotaCtrl.gravar)
.put('/',deffRotaCtrl.atualizar)
.delete('/:termo',deffRotaCtrl.excluir)

export default rotaDefRota;