import Usuario from "../modelo/usuario.js";
import poolConexao from "./conexao.js";

export default class UsuarioDAO {
    async gravar(usuario) {
        if(usuario instanceof Usuario){
            const sql = "INSERT INTO Usuarios(user_nome, user_senha, user_cpf, user_email, user_celular, user_categoria) VALUES($1,$2,$3,$4,$5) RETURNING user_codigo";
            const parametros = [usuario.nome, usuario.senha, usuario.cpf, usuario.email, usuario.celular];
            await poolConexao.query(sql, parametros);
        }
    }

    async atualizar(usuario) {
        if(usuario instanceof Usuario){
            const sql = "UPDATE Usuarios SET user_nome = $1, user_senha = $2, user_cpf = $3, user_email = $4, user_celular = $5 WHERE user_codigo = $6";
            const parametros = [usuario.nome, usuario.senha, usuario.cpf, usuario.email, usuario.celular, usuario.codigo];
            await poolConexao.query(sql, parametros);
        }
    }

    async excluir(usuario) {
        if(usuario instanceof Usuario){
            const sql = "DELETE FROM Usuarios WHERE user_codigo = $1";
            const parametros = [usuario.codigo];
            await poolConexao.query(sql, parametros);
        }
    }

    async consultar(parametroConsulta) {
        let sql = '';
        let parametros = [];
        if (!isNaN(parseInt(parametroConsulta))) {
            sql = 'SELECT * FROM Usuarios WHERE user_codigo = $1 order by user_nome';
            parametros = [parametroConsulta];
        }
        else {
            if (!parametroConsulta) {
                parametroConsulta = '';
            }
            sql = "SELECT * FROM Usuarios WHERE user_nome LIKE $1";
            parametros = ['%' + parametroConsulta + '%'];
        }
        const { rows: registros, fields:campos } = await poolConexao.query(sql, parametros);
        let listaUsuarios = [];
        for(const registro of registros){
            const usuario = new Usuario(registro.user_codigo, registro.user_nome, registro.user_senha, registro.user_cpf, registro.user_email, registro.user_celular);
            listaUsuarios.push(usuario);
        }
        return listaUsuarios;
    }
}