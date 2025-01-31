import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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
import rotaManutencao from './rotas/rotaManutencao.js';

dotenv.config();
const port = process.env.PORT || 8080;
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

app.use('/parentesco', rotaParentesco);
app.use('/escola', rotaEscola);
app.use('/aluno', rotaAluno);
app.use('/responsavel', rotaResponsavel);
app.use('/pontos-embarque', rotaPontoEmbarque);
app.use('/motorista', rotaMotorista);
app.use('/inscricao-aluno', rotaInscricaoAluno);
app.use('/veiculo', rotaVeiculo);
app.use('/definir-rota', rotaDefRota);
app.use('/usuario', rotaUsuario);
app.use('/autenticar', rotaAutenticar);
app.use('/alocar-alunos',rotaAlocarAlunos);
app.use('/inscricoes-rota',rota_Inscricoes_tem_Rotas);
app.use('/monitor',rotaMonitor);
app.use('/enviar-email',rotaEnviarEmail);
app.use('/manutencoes', rotaManutencao);
app.use('/', (req,res) => { res.send('Ola mundo!') });


app.listen(process.env.PORT || 8080, () => {
    console.log("servidor iniciado " + port)
});