require('dotenv').config();
const jwt = require('jsonwebtoken');
const userServie = require('../services/usuarioService');
const logger = require('../logs/logger')

// token armazenado em cookie, aumenta o nível de segurança contra XSS.
// Função para verificar e garantir a segurança das requisições que chegam na aplicação.
const authMiddleware = (req, res, next) => {
    try{
        const token = req.cookies.auth_token; // acessa o valor do token do cookie
    
        // Verifica se o token ta ok. 
        if(!token){ 
            logger.error('Tentativa de acesso negado: o token não foi encontrado no cookie.', {
                ip: req.ip
            });
            return res.status(401).json({error : "erro: acesso negado. Token não encontrado no cookie"})
        }
    
        logger.info("Token recebido do cookie:", token);
    
        // Validação do token de fato. Após a validade e a assinatura forem dadas como ok, 
        // o paylod (infos do user) fica disponível no decoded (objeto js)
        jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (error, decoded) => {
            if(error){
                logger.error('erro: a verificação do jwt falhou.', error.message)
                return res.status(401).json({error : "erro: token inválido. Faça login novamente."});
            }
            console.log("Token decodificado!", decoded);
            
            // Fixa o id do usuário autenticado para as etapas seguintes.
            req.userId = decoded.id;
        
            next(); // Permite seguir para a próxima execução do código. 

        });
    } catch(err) {
        console.log("Erro no middleware:", err.message);
        logger.error(err)
        res.status(500).json({error : "Erro no servidor"});
    }
}

module.exports = authMiddleware;