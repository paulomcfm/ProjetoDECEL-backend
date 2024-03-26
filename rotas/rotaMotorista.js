import { Router } from "express";
import MotoristaCtrl from "./Controle/MotoristaCtrl.js";

const motoristaCtrl = new MotoristaCtrl();
const rotaMotorista = new Router()

rotaMotorista
.get('/',motoristaCtrl.consultar)
.get('/:termo',motoristaCtrl.consultar)
.post('/',motoristaCtrl.gravar)
.delete('/',motoristaCtrl.deletar)
.put('/',motoristaCtrl.atualizar)




export default rotaMotorista;