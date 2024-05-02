import Usuario from "../modelo/usuario.js";

export default class UsuarioDAO {
    async gravar(usuario, client) {
        if(usuario instanceof Usuario){
            const sql = "INSERT INTO Usuarios(user_nome, user_senha, user_cpf, user_email, user_celular) VALUES($1,$2,$3,$4,$5) RETURNING user_nome";
            const parametros = [usuario.nome, usuario.senha, usuario.cpf, usuario.email, usuario.celular];
            await client.query(sql, parametros);
        }
    }

    async atualizar(usuario, client) {
        if(usuario instanceof Usuario){
            const sql = "UPDATE Usuarios SET user_nome = $1, user_senha = $2, user_email = $3, user_celular = $4 WHERE user_cpf = $5";
            const parametros = [usuario.nome, usuario.senha, usuario.email, usuario.celular,  usuario.cpf];
            await client.query(sql, parametros);
        }
    }

    async excluir(usuario, client) {
        if(usuario instanceof Usuario){
            const sql = "DELETE FROM Usuarios WHERE user_cpf = $1";
            const parametros = [usuario.cpf];
            await client.query(sql, parametros);
        }
    }

    async consultar(parametroConsulta, client) {
        let sql = '';
        let parametros = [];
        if (!parametroConsulta) {
            parametroConsulta = '';
        }
        sql = "SELECT * FROM Usuarios WHERE user_cpf LIKE $1 ORDER BY user_nome";
        parametros = ['%' + parametroConsulta + '%'];
        const { rows: registros, fields:campos } = await client.query(sql, parametros);
        let listaUsuarios = [];
        for(const registro of registros){
            const usuario = new Usuario(registro.user_nome, registro.user_senha, registro.user_cpf, registro.user_email, registro.user_celular);
            listaUsuarios.push(usuario);
        }
        return listaUsuarios;
    }    
}