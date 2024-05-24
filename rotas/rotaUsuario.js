import { Router } from 'express';
import UsuarioCtrl from '../controle/usuarioCtrl.js';
import { verifyToken } from '../authMiddleware.js';

const userCtrl = UsuarioCtrl.getInstance();
const rotaUsuario = new Router();

rotaUsuario.get('/', verifyToken, userCtrl.consultar)
    .get('/:termo', verifyToken, userCtrl.consultar)
    .post('/', verifyToken, userCtrl.gravar)
    .patch('/', verifyToken, userCtrl.atualizar)
    .put('/', verifyToken, userCtrl.atualizar)
    .delete('/', verifyToken, userCtrl.excluir);

export default rotaUsuario;