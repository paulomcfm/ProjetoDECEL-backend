import Motorista from '../modelo/motorista.js'

export default class MotoristaCtrl{
    
    
    async gravar(requisicao,resposta){
        const body = requisicao.body;
        const motorista = new Motorista(0,body.nome,body.cnh,body.telefone)
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
        let termo = requisicao.params.termo
        if(termo === undefined)
            termo = ""
        const motorista = new Motorista()
        motorista.buscar(termo).then((lista)=>{
            resposta.status(200).json({
                'status':true,
                'listaMotoristas':lista
            })
        }).catch((error)=>{
            resposta.status(500).json({
                'status':false,
                'mensagem':'Erro ao buscar motorista(s)'
            })
        })
    }


}