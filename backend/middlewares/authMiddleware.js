require('dotenv').config();
const jwt = require('jsonwebtoken');
const userServie = require('../services/usuarioService');

// Authorization com bearer e token ("token de portador"), que será guardado no localstorage.
// Função para verificar e garantir a segurança das requisições que chegam na aplicação.
const authMiddleware = (req, res, next) => {
    try{
        const {authorization} = req.headers; // Essa const desestrutura o objeto headers que é enviado.
        // Express converte "Authorization" para letras minúsculas. 
    
        // Verifica se a autorização ta ok ou se o token tem algum problema. 
        if(!authorization || !authorization.startsWith('Bearer ')){ 
            return res.status(401).json({error : "erro: acesso negado. Token não fornecido ou mal-formatado"})
        }
    
        // Recebe o token e separa em string, transformando em um array de dois itens  
        const parts = authorization.split(" ");
        if(parts.length !== 2){
            return res.status(401).json({error : "erro: token mal-formatado. Formato esperado: 'Bearer <token>'"})
        }
    
        // Extrai o token (segunda parte do array). 
        const token = parts[1];
        console.log("Token recebido (após split):", token);
        const bearer = parts[0];

        if(bearer !== "Bearer") {
            return res.status(401).json({error : "erro: o token não está iniciado com 'Bearer'"})
        }
    
        // Validação do token de fato. Após a validade e a assinatura forem dadas como ok, 
        // o paylod (infos do user) fica disponível no decoded (objeto js)
        jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (error, decoded) => {
            if(error){
                console.error("erro: verificação do token falhou.", error.message);
                return res.status(401).json({error : "erro: token inválido. Faça login novamente."});
            }
            console.log("Token decodificado!", decoded);
            
            // Editar aqui quando o usuarioService estiver pronto.
    
            // Fixa o id do usuário autenticado para as etapas seguintes.
            req.userId = decoded.id;
        
            next(); // Permite seguir para a próxima execução do código. 

        });
    } catch(err) {
        console.log("Erro no middleware:", err.message);
        res.status(500).json({error : "Erro no servidor"});
    }
}

module.exports = authMiddleware;