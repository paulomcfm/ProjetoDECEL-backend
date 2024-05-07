import { Router } from 'express';
import defRotaCtrl from '../controle/defRotaCtrl.js';

const defrotaCtrl = defRotaCtrl.getInstance();
const rota_Inscricoes_tem_Rotas = new Router();


rota_Inscricoes_tem_Rotas.get('/',defrotaCtrl.consultarInscricoesDaRota).get('/:termo',defrotaCtrl.consultarInscricoesDaRota);


export default rota_Inscricoes_tem_Rotas;