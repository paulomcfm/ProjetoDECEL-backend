import { Router } from 'express';
import defRotaCtrl from '../controle/defRotaCtrl.js';

const rotaDefRota = new Router();

rotaDefRota.get('/',defRotaCtrl.consultar).get('/:termo',defRotaCtrl.consultar).post('/', defRotaCtrl.gravar).put('/',defRotaCtrl.atualizar)

export default rotaDefRota;