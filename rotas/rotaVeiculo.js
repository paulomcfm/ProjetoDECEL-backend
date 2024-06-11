import { Router } from 'express';
import VeiculoCtrl from '../controle/veiculoCtrl.js';

const veiCtrl = VeiculoCtrl.getInstance();
const rotaVeiculo = new Router();

rotaVeiculo.get('/', veiCtrl.consultar)
    .get('/:termo', veiCtrl.consultar)
    .get('/rota/:termo',veiCtrl.consultarRota)
    .post('/', veiCtrl.gravar)
    .patch('/', veiCtrl.atualizar)
    .put('/', veiCtrl.atualizar)
    .delete('/', veiCtrl.excluir);

export default rotaVeiculo;