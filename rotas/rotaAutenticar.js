import {Router} from 'express';
import UsuarioCtrl from '../controle/usuarioCtrl.js';

const userCtrl = UsuarioCtrl.getInstance();
const rotaAutenticar = new Router();

rotaAutenticar.get('/', userCtrl.autenticar);

export default rotaAutenticar;