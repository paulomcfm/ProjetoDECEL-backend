import Usuario from "../modelo/usuario.js";
import poolConexao from "../persistencia/conexao.js";

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
            if (nome && senha && cpf && email && celular) {
                const usuario = new Usuario(nome, senha, cpf, email, celular);
                const client = await poolConexao.connect();
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
    
        if (requisicao.method !== 'GET' || !requisicao.is('application/json')) {
            return resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método GET e envie os dados no formato JSON para autenticar o usuário!'
            });
        }
        const { nome, cpf, senha } = requisicao.body;
        if (!nome || !cpf || !senha) {
            return resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, informe o nome de usuário e o CPF!'
            });
        }
        try {
            const usuario = new Usuario(nome);
            const client = await poolConexao.connect();
            await client.query('BEGIN');
            const usuarioConsultado = await usuario.consultar(nome);
            if (usuarioConsultado && usuarioConsultado[0].cpf === cpf && usuarioConsultado[0].senha === senha) {
                resposta.status(200).json({
                    "status": true,
                    "mensagem": 'Usuario autenticado com sucesso!'
                });
            } else {
                resposta.status(401).json({
                    "status": false,
                    "mensagem": 'Nome de usuario ou CPF ou senha inválidos!'
                });
            }
            await client.query('COMMIT');
        } catch (erro) {
            await client.query('ROLLBACK');
            resposta.status(500).json({
                "status": false,
                "mensagem": 'Erro ao autenticar o usuario: ' + erro.message
            });
        } finally {
            client.release();
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
            const usuario = new Usuario(nome, senha, cpf, email, celular);
            if (nome && senha && cpf && email && celular) {
                const client = await poolConexao.connect();
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
            const nome = dados.nome;
            if (nome) {
                const client = await poolConexao.connect();
                try {
                    await client.query('BEGIN');
                    const usuario = new Usuario(nome);
                    usuario.excluir(client).then(() => {
                        resposta.status(200).json({
                            "status": true,
                            "nomeUsuario": usuario.nome,
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
                    "mensagem": 'Por favor, informe o nome da usuario!'
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
        resposta.type('application/json');
        let termo = requisicao.params.termo;
        if (!termo) {
            termo = '';
        }
        if (requisicao.method === 'GET') {
            const client = await poolConexao.connect();
            const usuarios = new Usuario();
            usuarios.consultar(termo, client).then((listaUsuarios) => {
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