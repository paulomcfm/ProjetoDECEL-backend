import Usuario from "../modelo/usuario";

export default class UsuarioCtrl {
    gravar(requisicao, resposta) {
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
                usuario.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "nomeUsuario": usuario.nome,
                        "mensagem": 'usuario incluida com sucesso!'
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": 'Erro ao registrar a usuario: ' + erro.message
                    });
                });
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
                "mensagem": 'Por favor, utilize o método POST para cadastrar uma usuario!'
            });
        }
    }

    atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const nome = dados.nome;
            const senha = dados.senha;
            const cpf = dados.cpf;
            const email = dados.email;
            const celular = dados.celular;
            if (nome && senha && cpf && email && celular) {
                const usuario = new Usuario(nome, senha, cpf, email, celular);
                usuario.atualizar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": usuario.codigo,
                        "mensagem": 'usuario alterada com sucesso!'
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": 'Erro ao alterar a usuario: ' + erro.message
                    });
                });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": 'Por favor, informe o nome e o cpf do usuario!'
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

    excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const nome = dados.nome;
            if (nome) {
                const usuario = new Usuario(nome);
                usuario.excluir().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "nomeGerado": usuario.nome,
                        "mensagem": 'usuario excluída com sucesso!'
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": 'Erro ao excluir a usuario: ' + erro.message
                    });
                });
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

    consultar(requisicao, resposta) {
        resposta.type('application/json');
        let termo = requisicao.params.termo;
        if (!termo) {
            termo = '';
        }
        if (requisicao.method === 'GET') {
            const usuarios = new Usuario();
            usuarios.consultar(termo).then((listaUsuarios) => {
                resposta.json({
                    "status": true,
                    "listaUsuarios": listaUsuarios
                });
            }).catch((erro) => {
                resposta.status(500).json({
                    "status": false,
                    "mensagem": 'Erro ao consultar as usuarios: ' + erro.message
                });
            });
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": 'Por favor, utilize o método GET para consultar as usuarios!'
            });
        }
    }
}