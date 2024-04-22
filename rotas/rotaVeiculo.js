import { Router } from 'express';
import VeiculoCtrl from '../controle/veiculoCtrl.js';

// const aluCtrl = new VeiculoCtrl();
const rotaVeiculo = new Router();

rotaVeiculo.get('/', VeiculoCtrl.consultar)
    .get('/:termo', VeiculoCtrl.consultar)
    .post('/', VeiculoCtrl.gravar)
    .patch('/', VeiculoCtrl.atualizar)
    .put('/', VeiculoCtrl.atualizar)
    .delete('/', VeiculoCtrl.excluir);

export default rotaVeiculo;