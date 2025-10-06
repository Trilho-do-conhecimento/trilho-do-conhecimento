let usuarios = [
    {
        id:1, nome: "Luana", email: "luanaemail@gmail.com", senha: "1234"
    } 
]

let documentos = [
    {
        id:1, titulo:"Contrato A", status:"Pendente", usuarioID: 1
    }
]

let logs = [
    {
        id:1, acao:"login", usuarioID:1, data: new Date() 
    }
]

module.exports(usuarios, documentos, logs)