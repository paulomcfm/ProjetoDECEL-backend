import {Router} from 'express';
import UsuarioCtrl from '../controle/usuarioCtrl.js';

const userCtrl = UsuarioCtrl.getInstance();
const rotaEnviarEmail = new Router();

rotaEnviarEmail.post('/', userCtrl.enviarEmail);

export default rotaEnviarEmail;