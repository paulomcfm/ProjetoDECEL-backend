import express from 'express';
import rotaEscola from './rotas/rotaEscola.js';
import rotaResponsavel from './rotas/rotaResponsavel.js';
import rotaAluno from './rotas/rotaAluno.js';
import rotaParentesco from './rotas/rotaParentesco.js';
import cors from 'cors';
import rotaPontoEmbarque from './rotas/rotaPontoEmbarque.js';
import rotaMotorista from './rotas/rotaMotorista.js'
const app = express();
const porta = 4000;
const host = '0.0.0.0';

app.use(express.json());
app.use(cors({origin:"*"}));


app.use('/parentesco', rotaParentesco);
app.use('/escola', rotaEscola);
app.use('/aluno', rotaAluno);
app.use('/responsavel', rotaResponsavel);
app.use('/pontos-embarque', rotaPontoEmbarque);
app.use('/motorista',rotaMotorista)

app.listen(porta, host, () => {
    console.log(`API do sistema em execução: ${host}:${porta}`);
});
