import poolConexao from "../persistencia/conexao.js";
import defRota from "../modelo/defRota.js";
import Rotas_Motoristas from '../modelo/rotas_motoristas.js'
import Rotas_Pontos from "../modelo/rotas_pontos.js";
import PontoEmbarque from "../modelo/pontoEmbarque.js";
import Motorista from "../modelo/motorista.js";
import Inscricao from "../modelo/inscricao.js";

export default class defRotaCtrl {
    static _instance = null;

    constructor() {
        defRotaCtrl._instance = this;
    }

    static getInstance() {
        if (defRotaCtrl._instance == null)
            new defRotaCtrl();
        return defRotaCtrl._instance;
    }

    async gravar(requisicao, resposta) {
        resposta.type('application/json');
        try {
            const dados = requisicao.body;
            const nome = dados.nome
            const km = dados.km
            const periodo = dados.periodo
            const ida = dados.ida
            const volta = dados.volta
            const veiculo = dados.veiculo
            const monitor = dados.monitor
            const motoristas = JSON.parse(dados.motoristas)
            const pontos = JSON.parse(dados.pontos)
            const rota = new defRota(0, nome, km, periodo, ida, volta, veiculo, monitor, [], [])
            const client = await poolConexao.getInstance().connect()
            try {
                await client.query('BEGIN');
                await rota.gravar(client)
                // lista sera usada para guardar os objetos de ponto de embarque
                let lista = []
                for (const ponto of pontos) {
                    lista.push(new PontoEmbarque(ponto))
                }
                const rotaP = new Rotas_Pontos(rota, lista)
                await rotaP.gravar(client)
                // lista sera usada para guardar os objetos de motoristas
                lista = []
                for (const motorista of motoristas) {
                    lista.push(new Motorista(motorista))
                }
                const rotaM = new Rotas_Motoristas(rota, lista)
                await rotaM.gravar(client)

                resposta.status(200).json({
                    status: true,
                    mensagem: "Rota gravada com sucesso"
                })

                await client.query('COMMIT')
            } catch (erro) {
                console.log(erro)
                await client.query('ROLLBACK');
                resposta.status(500).json({
                    "status": false,
                    "mensagem": 'Erro ao cadastrar rota'
                });
            }
            await client.release()
        }
        catch (erro) {
            resposta.status(500).json({
                "status": false,
                "mensagem": 'Erro ao cadastrar rota'
            });
        }
    }

    async consultar(requisicao, resposta) {
        try {
            let termo = requisicao.params.termo
            if (termo === undefined)
                termo = ""
            const rota = new defRota()
            // usado para pegar qualquer erro que acontecer dentro das consultas
            const client = await poolConexao.getInstance().connect()
            try {
                await client.query('BEGIN');
                const lista = await rota.consultar(client, termo)
                const rotaP = new Rotas_Pontos()
                const rotaM = new Rotas_Motoristas()
                for (const reg of lista) {
                    reg.pontos = await rotaP.consultarPontos(client, reg.codigo)
                    reg.motoristas = await rotaM.consultar(client, reg.codigo)
                }

                resposta.status(200).json({
                    status: true,
                    mensagem: "consultado com sucesso",
                    listaRotas: lista
                })
            } catch (erro) {
                // ao entrar aqui fazer o rollback
                await client.query('ROLLBACK')
                console.log(erro)
                resposta.status(500).json({
                    status: false,
                    mensagem: "Erro ao realizar consulta",
                    listaRotas: []
                })
            }
            finally {
                await client.release()
            }
        }
        catch (erro) {
            resposta.status(500).json({
                status: false,
                mensagem: 'Erro ao realizar a consulta',
                listaRotas: []
            })
        }
    }

    async consultarInscricoesDaRota(requisicao, resposta) {
        try {
            let termo = requisicao.params.termo
            if (termo == undefined)
                termo = ""
            const rota = new defRota(termo)
            let lista = []
            const client = await poolConexao.getInstance().connect()
            await client.query('BEGIN')
            try {
                lista = await rota.consultar(client, termo)
                const inscricoes = new Inscricao()
                const rotaP = new Rotas_Pontos()
                const rotaM = new Rotas_Motoristas()
                for (const reg of lista) {
                    reg.pontos = await rotaP.consultarPontos(client, reg.codigo)
                    reg.motoristas = await rotaM.consultar(client, reg.codigo)
                    reg.inscricoes = await inscricoes.consultarPorRota(client, reg.codigo)
                }
                resposta.status(200).json({
                    status: true,
                    mensagem: 'Consultado com sucesso',
                    listaRotas: lista
                })
            } catch (erro) {
                resposta.status(500).json({
                    status: false,
                    mensagem: 'Erro ao realizar a consulta',
                    listaRotas: lista
                })
            }
            finally { await client.release() }

        } catch (erro) {
            resposta.status(500).json({
                status: false,
                mensagem: 'Erro ao realizar a consulta',
                listaRotas: lista
            })
        }
    }

    async atualizar(requisao, resposta) {
        const dados = requisao.body
        const rota = new defRota(dados.codigo, dados.nome, dados.km, dados.periodo, dados.ida, dados.volta, dados.veiculo, dados.monitor, JSON.parse(dados.pontos), JSON.parse(dados.motoristas), [])

        try {
            const client = await poolConexao.connect()
            await client.query('BEGIN')
            await rota.atualizar(client).then(() => {
                client.query('COMMIT')
                resposta.status(200).json({
                    status: true,
                    mensagem: "Rota atualizada com sucesso!!!"
                })
            }).catch(async (erro) => {
                await client.query('ROLLBACK');
                resposta.status(500).json({
                    status: false,
                    mensagem: 'Erro ao atualizar a rota: ' + erro,
                })
            }).finally(() => {
                client.release()
            })
        } catch (erro) {
            resposta.status(500).json({
                status: false,
                mensagem: 'Erro ao atualizar a rota: ' + erro,
            })
        }
    }

    async excluir(requisicao, resposta) {
        const termo = requisicao.params.termo
        const rota = new defRota(termo)
        try {
            const client = await poolConexao.getInstance().connect()
            const qtdInscr = await rota.consultarQtdInscricoes(client)
            if (qtdInscr.length === 0) {
                await new Rotas_Pontos().deletar(client, rota.codigo)
                await new Rotas_Motoristas().deletar(client, rota.codigo)
                await rota.deletar(client)
                resposta.status(200).json({
                    status: true,
                    "mensagem": "Rota deletada com sucesso"
                })
            } else {
                resposta.status(500).json({
                    status: false,
                    mensagem: "Rota não pode ser deletada (contém inscrições vinculadas a ela)"
                })
            }
        } catch (erro) {
            resposta.status(500).json({
                status: false,
                mensagem: "Erro ao deletar rota: " + erro
            })
        }
    }
}