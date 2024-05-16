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
import rotaUsuario from './rotas/rotaUsuario.js';
import rotaAutenticar from './rotas/rotaAutenticar.js';
import rotaAlocarAlunos from './rotas/rotaAlocarAlunos.js';
import rota_Inscricoes_tem_Rotas from './rotas/rota_Inscricoes_tem_Rotas.js';
import rotaMonitor from './rotas/rotaMonitor.js';
import rotaEnviarEmail from './rotas/rotaEnviarEmail.js';

const app = express();
const porta = '8080'
app.use(express.json());
app.use(cors({ origin: "*" }));

app.use('/parentesco', rotaParentesco);
app.use('/escola', rotaEscola);
app.use('/aluno', rotaAluno);
app.use('/responsavel', rotaResponsavel);
app.use('/pontos-embarque', rotaPontoEmbarque);
app.use('/motorista', rotaMotorista);
app.use('/inscricao-aluno', rotaInscricaoAluno);
app.use('/motorista', rotaMotorista);
app.use('/veiculo', rotaVeiculo);
app.use('/definir-rota', rotaDefRota);
app.use('/usuario', rotaUsuario);
app.use('/definir-rota',rotaDefRota);
app.use('/autenticar', rotaAutenticar);
app.use('/alocar-alunos',rotaAlocarAlunos);
app.use('/inscricoes-rota',rota_Inscricoes_tem_Rotas);
app.use('/monitor',rotaMonitor);
app.use('/enviar-email',rotaEnviarEmail);


app.listen(porta, () => { console.log("servidor iniciado " + porta) });