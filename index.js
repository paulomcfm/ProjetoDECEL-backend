import express from 'express';
import cors from 'cors';
import rotaEscola from './rotas/rotaEscola.js';
import rotaResponsavel from './rotas/rotaResponsavel.js';
import rotaAluno from './rotas/rotaAluno.js';
import rotaParentesco from './rotas/rotaParentesco.js';
import rotaPontoEmbarque from './rotas/rotaPontoEmbarque.js';
import rotaMotorista from './rotas/rotaMotorista.js'
import rotaInscricaoAluno from './rotas/rotaInscricaoAluno.js';
import rotaVeiculo from './rotas/rotaVeiculo.js'
import rotaDefRota from './rotas/rotaDefRota.js';
import rotaAlocarAlunos from './rotas/rotaAlocarAlunos.js';

const app = express();
const porta = '8080'
app.use(express.json());
app.use(cors({ origin: "*" }));

app.use('/parentesco', rotaParentesco);
app.use('/escola', rotaEscola);
app.use('/aluno', rotaAluno);
app.use('/responsavel', rotaResponsavel);
app.use('/pontos-embarque', rotaPontoEmbarque);
app.use('/motorista', rotaMotorista)
app.use('/inscricao-aluno', rotaInscricaoAluno)
app.use('/motorista', rotaMotorista);
app.use('/veiculo', rotaVeiculo);
app.use('/definir-rota',rotaDefRota);
app.use('/alocar-alunos',rotaAlocarAlunos);


app.listen(porta, () => { console.log("servidor iniciado " + porta) })