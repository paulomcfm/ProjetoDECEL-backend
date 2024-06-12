import Usuario from "../modelo/usuario.js";

export default class UsuarioDAO {
    async gravar(usuario, client) {
        if (usuario instanceof Usuario) {
            const sql = "INSERT INTO Usuarios(user_nome, user_senha, user_cpf, user_email, user_celular, user_nivel) VALUES($1,$2,$3,$4,$5,$6) RETURNING user_nome";
            const parametros = [usuario.nome, usuario.senha, usuario.cpf, usuario.email, usuario.celular, usuario.nivel];
            await client.query(sql, parametros);
        }
    }

    async atualizar(usuario, client) {
        if (usuario instanceof Usuario) {
            const sql = "UPDATE Usuarios SET user_nome = $1, user_senha = $2, user_email = $3, user_celular = $4, user_nivel = $5 WHERE user_cpf = $6";
            const parametros = [usuario.nome, usuario.senha, usuario.email, usuario.celular, usuario.nivel, usuario.cpf];
            await client.query(sql, parametros);
        }
    }

    async excluir(usuario, client) {
        if (usuario instanceof Usuario) {
            const sql = "DELETE FROM Usuarios WHERE user_cpf = $1";
            const parametros = [usuario.cpf];
            await client.query(sql, parametros);
        }
    }

    async consultar(client) {
        const sql = "SELECT * FROM USUARIOS"
        let parametros = [];
        const listaUsuarios = [];
        const { rows: registros } = await client.query(sql, parametros);
        for (const registro of registros) {
            const usuario = new Usuario(registro.user_nome, registro.user_senha, registro.user_cpf, registro.user_email, registro.user_celular, registro.user_nivel);
            listaUsuarios.push(usuario);
        }
        return listaUsuarios;
    }

    async consultarCPF(cpf, client) {
        const sql = "SELECT * FROM Usuarios WHERE user_cpf = $1";
        const parametros = [cpf];
        const { rows: registros } = await client.query(sql, parametros);
        if (registros.length > 0) {
            const registro = registros[0];
            return new Usuario(registro.user_nome, registro.user_senha, registro.user_cpf, registro.user_email, registro.user_celular, registro.user_nivel);
        } else {
            return null;
        }
    }

    async consultarEmail(email, client) {
        const sql = "SELECT * FROM Usuarios WHERE user_email = $1";
        const parametros = [email];
        const { rows: registros } = await client.query(sql, parametros);
        
        if (registros.length > 0) {
            const registro = registros[0];
            return new Usuario(registro.user_nome, registro.user_senha, registro.user_cpf, registro.user_email, registro.user_celular, registro.user_nivel);
        } else {
            return null;
        }
    }

    async salvarCodigoRedefinicao(email, codigo, client) {
        const sql = "INSERT INTO RedefinicoesSenha (user_email, codigo, data_criacao) VALUES ($1, $2, CURRENT_TIMESTAMP)";
        const parametros = [email, codigo];
        await client.query(sql, parametros);
    }
    

    async verificarCodigoRedefinicao(email, codigo, client) {
        const sql = "SELECT * FROM RedefinicoesSenha WHERE user_email = $1 AND codigo = $2 AND CURRENT_TIMESTAMP - data_criacao < INTERVAL '30 minutes'";
        const parametros = [email, codigo];
        const { rows: registros } = await client.query(sql, parametros);
        return registros.length > 0;
    }  

    async removerCodigoRedefinicao(email, client) {
        const sql = "DELETE FROM RedefinicoesSenha WHERE user_email = $1";
        const parametros = [email];
        await client.query(sql, parametros);
    }
    
    async redefinirSenha(email, novaSenha, client) {
        const sql = "UPDATE Usuarios SET user_senha = $1 WHERE user_email = $2";
        const parametros = [novaSenha, email];
        await client.query(sql, parametros);
    }
}