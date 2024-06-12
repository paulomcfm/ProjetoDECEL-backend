import enviarCodigo from "../servicos/servicoEmail.js";
import crypto from "crypto";
import dotenv from "dotenv";
import Usuario from "../modelo/usuario.js";
import poolConexao from "../persistencia/conexao.js";

dotenv.config(); // Carregar variáveis de ambiente

export default class UsuarioCtrl {
    static _instance = null;

    constructor() 
    {
        UsuarioCtrl._instance = this;
    }

    static getInstance()
    {
        if(UsuarioCtrl._instance==null)
            new UsuarioCtrl();
        return UsuarioCtrl._instance;
    }

    async gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const nome = dados.nome;
            const senha = dados.senha;
            const cpf = dados.cpf;
            const email = dados.email;
            const celular = dados.celular;
            const nivel = dados.nivel;
            if (nome && senha && cpf && email && celular && nivel) {
                const usuario = new Usuario(nome, senha, cpf, email, celular, nivel);
                const client = await poolConexao.getInstance().connect();
                try {
                    await client.query('BEGIN');
                    usuario.gravar(client).then(() => {
                        resposta.status(200).json({
                            "status": true,
                            "nomeUsuario": usuario.nome,
                            "mensagem": 'Usuario incluído com sucesso!'
                        });
                        client.query('COMMIT');
                    }).catch(async (erro) => {
                        await client.query('ROLLBACK');
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": 'Erro ao registrar o usuario: ' + erro.message
                        });
                    });
                } catch (e) {
                    await client.query('ROLLBACK');
                    throw e;
                } finally {
                    client.release();
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Por favor, preencha todos os campos!'
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método POST e envie os dados no formato JSON para cadastrar um usuário!'
            });
        }
    }

    async autenticar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method !== 'POST' || !requisicao.is('application/json')) {
            return resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método POST e envie os dados no formato JSON para autenticar o usuário!'
            });
        }
        const { nome, cpf, senha } = requisicao.body;
        if (!nome || !cpf || !senha) {
            return resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, informe o nome de usuário, CPF e senha!'
            });
        }
        const client = await poolConexao.getInstance().connect();
        try {
            await client.query('BEGIN');
            const usuario = new Usuario(nome,senha,cpf);
            const usuarioConsultado = await usuario.consultarCPF(usuario.cpf, client);
            if (usuarioConsultado && usuarioConsultado.nome === nome && usuarioConsultado.senha === senha) {
                resposta.status(200).json({
                    "status": true,
                    "usuario": usuarioConsultado,
                    "mensagem": 'Usuário autenticado com sucesso!'
                });
            } else {
                resposta.status(401).json({
                    "status": false,
                    "mensagem": 'Nome de usuário, CPF ou senha inválidos!'
                });
            }
    
            await client.query('COMMIT');
        } catch (erro) {
            if (client) {
                await client.query('ROLLBACK');
            }
            resposta.status(500).json({
                "status": false,
                "mensagem": 'Erro ao autenticar o usuário: ' + erro.message
            });
        } finally {
            if (client) {
                client.release();
            }
        }
    }
    
    async solicitarCodigoRedefinicao(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method !== 'POST' || !requisicao.is('application/json')) {
            return resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método POST e envie os dados no formato JSON para solicitar o código!'
            });
        }
        const { email } = requisicao.body;
        if (!email) {
            return resposta.status(400).json({ status: false, mensagem: 'Por favor, forneça um endereço de e-mail!' });
        }
    
        let client;
        try {
            client = await poolConexao.getInstance().connect();
            const usuario = new Usuario();
            const usuarioConsultado = await usuario.consultarEmail(email, client);
            if (usuarioConsultado) {
                const codigo = crypto.randomBytes(3).toString('hex'); // Gera um código aleatório de 6 caracteres
                await usuario.salvarCodigoRedefinicao(email, codigo, client);
    
                const emailEnviado = await enviarCodigo(email, codigo);
                if (emailEnviado) {
                    resposta.status(200).json({ status: true, mensagem: 'Código de redefinição enviado para seu e-mail!' });
                } else {
                    resposta.status(500).json({ status: false, mensagem: 'Erro ao enviar o código de redefinição. Tente novamente mais tarde.' });
                }
            } else {
                resposta.status(404).json({ status: false, mensagem: 'E-mail não encontrado!' });
            }
        } catch (erro) {
            resposta.status(500).json({ status: false, mensagem: 'Erro ao solicitar a redefinição: ' + erro.message });
        } finally {
            if (client) {
                client.release();
            }
        }
    }    
    
    
    async redefinirSenha(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method !== 'POST' || !requisicao.is('application/json')) {
            return resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método POST e envie os dados no formato JSON para redefinir a senha!'
            });
        }
        const { email, codigo, novaSenha } = requisicao.body;
        if (!email || !codigo || !novaSenha) {
            return resposta.status(400).json({ status: false, mensagem: 'Por favor, forneça todos os dados necessários!' });
        }
    
        let client;
        try {
            client = await poolConexao.getInstance().connect();
            const usuario = new Usuario();
            const codigoValido = await usuario.verificarCodigoRedefinicao(email, codigo, client);
            if (codigoValido) {
                await usuario.redefinirSenha(email, novaSenha, client);
                await usuario.removerCodigoRedefinicao(email, client);
                resposta.status(200).json({ status: true, mensagem: 'Senha redefinida com sucesso!' });
            } else {
                resposta.status(400).json({ status: false, mensagem: 'Código de redefinição inválido ou expirado!' });
            }
        } catch (erro) {
            resposta.status(500).json({ status: false, mensagem: 'Erro ao redefinir a senha: ' + erro.message });
        } finally {
            if (client) {
                client.release();
            }
        }
    }    

    async atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const nome = dados.nome;
            const senha = dados.senha;
            const cpf = dados.cpf;
            const email = dados.email;
            const celular = dados.celular;
            const nivel = dados.nivel;
            const usuario = new Usuario(nome, senha, cpf, email, celular, nivel);
            if (nome && senha && cpf && email && celular && nivel) {
                const client = await poolConexao.getInstance().connect();
                try {
                    await client.query('BEGIN');
                    usuario.atualizar(client).then(() => {
                        resposta.status(200).json({
                            "status": true,
                            "nomeUsuario": usuario.nome,
                            "mensagem": 'Usuario alterado com sucesso!'
                        });
                        client.query('COMMIT');
                    }).catch(async (erro) => {
                        await client.query('ROLLBACK');
                        if (erro.code === '23505') {
                            resposta.status(400).json({
                                "status": false,
                                "mensagem": 'CPF já cadastrado.'
                            });
                        } else {
                            resposta.status(500).json({
                                "status": false,
                                "mensagem": 'Erro ao alterar o usuario: ' + erro.message
                            });
                        }
                    });
                } catch (e) {
                    await client.query('ROLLBACK');
                    throw e;
                } finally {
                    client.release();
                }
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Por favor, informe os campos do usuario!'
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize os métodos PUT ou PATCH para atualizar uma usuario!'
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const cpf = dados.cpf;
            if (cpf) {
                const client = await poolConexao.getInstance().connect();
                try {
                    await client.query('BEGIN');
                    const usuario = new Usuario('','',cpf);
                    usuario.excluir(client).then(() => {
                        resposta.status(200).json({
                            "status": true,
                            "cpfUsuario": usuario.cpf,
                            "mensagem": 'Usuario excluído com sucesso!'
                        });
                        client.query('COMMIT');
                    }).catch(async (erro) => {
                        await client.query('ROLLBACK');
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": 'Erro ao excluir o usuario: ' + erro.message
                        });
                    });
                } catch (e) {
                    await client.query('ROLLBACK');
                    throw e;
                } finally {
                    client.release();
                }
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Por favor, informe o cpf do usuario!'
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize os métodos DELETE para excluir um usuario!'
            });
        }
    }

    async consultar(requisicao, resposta) {
        let termo = requisicao.params.termo;
        if (!termo) {
            termo = '';
        }
        if (requisicao.method === 'GET') {
            const client = await poolConexao.getInstance().connect();
            const usuarios = new Usuario();
            usuarios.consultar(client).then((listaUsuarios) => {
                console.log(listaUsuarios);
                resposta.json({
                    "status": true,
                    "listaUsuarios": listaUsuarios
                });
            }).catch(async (erro) => {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": 'Erro ao consultar os usuarios: ' + erro.message
                });
            });
            client.release();
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método GET para consultar os usuarios!'
            });
        }
    }
}