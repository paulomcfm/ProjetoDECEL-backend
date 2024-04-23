import { Router } from 'express';
import defRotaCtrl from '../controle/defRotaCtrl.js';

const rotaDefRota = new Router();

rotaDefRota.post('/', defRotaCtrl.gravar)

export default rotaDefRota;