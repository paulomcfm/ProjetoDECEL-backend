import { Router } from 'express';
import ManutencaoCtrl from '../controle/manutencaoCtrl.js';

const manutencaoCtrl = ManutencaoCtrl.getInstance();
const rotaManutencao = new Router();

rotaManutencao.get('/', manutencaoCtrl.consultar)
    .get('/:placa', manutencaoCtrl.consultarPorPlaca)
    .post('/', manutencaoCtrl.gravar)
    .patch('/', manutencaoCtrl.atualizar)
    .put('/', manutencaoCtrl.atualizar)
    .delete('/', manutencaoCtrl.excluir);

export default rotaManutencao;
