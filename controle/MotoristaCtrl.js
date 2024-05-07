import Motorista from '../modelo/motorista.js'
import poolConexao from '../persistencia/conexao.js';

export default class MotoristaCtrl{
    
    
    async gravar(requisicao,resposta){
        const body = requisicao.body;
        const motorista = new Motorista(0,body.nome,body.cnh,body.celular)
        await motorista.gravar().then(()=>{
                resposta.status(200).json({
                    'status':true,
                    'mensagem':'Motorista gravado com sucesso'
                })
        }).catch((error)=>{
            resposta.status(500).json({
                'status':false,
                'mensagem':`Erro ao gravar motorista. (${error})` 
            })
        })
    }

    async deletar(requisicao,resposta){
        const body = requisicao.body
        const motorista = new Motorista(body.id)
        motorista.deletar().then(()=>{
            resposta.status(200).json({
                'status':true,
                'mensagem':'Motorista deletado com sucesso'
            })
        }).catch((error)=>{
            resposta.status(500).json({
                'status':false,
                'mensagem':`Erro ao deletar motorista. (${error})` 
            })
        })
    }

    async atualizar(requisicao,resposta){
         const body = requisicao.body
         const motorista = new Motorista(0,body.nome,body.cnh,body.telefone)
         motorista.atualizar().then(()=>{
            resposta.status(200).json({
                'status':true,
                'mensagem':'Motorista atualizado com sucesso'
            })
        }).catch((error)=>{
            resposta.status(500).json({
                'status':false,
                'mensagem':`Erro ao atualizar motorista. (${error})` 
            })
        })
    }

    async consultar(requisicao,resposta){
        try{
            let termo = requisicao.params.termo
            if(termo === undefined)
                termo = ""
            const client = await poolConexao.getInstance().connect()
            const motorista = new Motorista()

            try{
                await client.query('BEGIN')
                const lista = await motorista.buscar(client,termo)
                resposta.status(200).json({
                    'status':true,
                    'listaMotoristas':lista
                })
                
                await client.query('COMMIT')
            }catch(erro){
                client.query('ROLLBACK')
                resposta.status(500).json({
                    'status':false,
                    'mensagem':'Erro ao buscar motorista(s)'
                })
            }

            await client.release()
        }catch(erro){
            resposta.status(500).json({
                'status':false,
                'mensagem':'Erro ao buscar motorista(s)'
            })
        }
    }


}