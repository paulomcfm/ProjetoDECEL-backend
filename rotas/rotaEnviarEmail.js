import { Router } from 'express';
import UsuarioCtrl from '../controle/usuarioCtrl.js';

const userCtrl = UsuarioCtrl.getInstance();
const rotaEnviarEmail = new Router();

// Rotas separadas para solicitar código e redefinir senha
rotaEnviarEmail.post('/solicitar-redefinicao', userCtrl.solicitarCodigoRedefinicao);
rotaEnviarEmail.post('/redefinir-senha', userCtrl.redefinirSenha);

export default rotaEnviarEmail;
