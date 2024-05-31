import { Router } from 'express';
import ManutencaoCtrl from '../controle/manutencaoCtrl.js';

const manutencaoCtrl = ManutencaoCtrl.getInstance();
const rotaManutencaoPreventiva = new Router();

rotaManutencaoPreventiva.post('/', manutencaoCtrl.gravarPreventiva);

export default rotaManutencaoPreventiva;
