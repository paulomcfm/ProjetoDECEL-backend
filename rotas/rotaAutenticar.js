import {Router} from 'express';
import UsuarioCtrl from '../controle/usuarioCtrl.js';

const userCtrl = new UsuarioCtrl();
const rotaAutenticar = new Router();

rotaAutenticar.get('/', userCtrl.autenticar);

export default rotaAutenticar;