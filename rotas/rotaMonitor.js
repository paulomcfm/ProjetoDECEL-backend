import { Router } from 'express';
import MonitorCtrl from '../controle/monitorCtrl.js'

const monitorCtrl = MonitorCtrl.getInstance();
const rotaMonitor = new Router();

rotaMonitor.get('/',monitorCtrl.consultar).get('/:termo',monitorCtrl.consultar)

export default rotaMonitor
