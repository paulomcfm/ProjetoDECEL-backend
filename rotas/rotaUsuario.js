import {Router} from 'express';
import UsuarioCtrl from '../controle/usuarioCtrl.js';

const userCtrl = new UsuarioCtrl();
const rotaUsuario = new Router();

rotaUsuario.get('/', userCtrl.consultar)
    .get('/:termo', userCtrl.consultar)
    .post('/', userCtrl.gravar)
    .patch('/', userCtrl.atualizar)
    .put('/', userCtrl.atualizar)
    .delete('/', userCtrl.excluir);

export default rotaUsuario;