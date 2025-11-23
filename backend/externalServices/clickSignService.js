require('dotenv').config();
const ACCESS_TOKEN_API = process.env.CLICKSIGN_TOKEN;
const { parse } = require('dotenv');
const logger = require('../logs/logger')

const options = {
    headers: {
        'accept': 'application/json',
        'Authorization': ACCESS_TOKEN_API,
        'content-type': 'application/json'
    }
}

async function enviarParaAssinatura(fileBase64, filename, signatarios) {

    console.log("Token API:", ACCESS_TOKEN_API ? "ok" : "token vazio");

    try {
        let base64final = fileBase64;

        if (!fileBase64.startsWith('data:application/pdf;base64,')) {
            base64final = `data:application/pdf;base64,${fileBase64}`;
        }

        // corpo do documento - isso funciona
        const bodyDocumento = JSON.stringify({
            "document": {
                "path": `/${filename}`,
                "content_base64": base64final,
            }
        });

        // cria documento - isso funciona 
        const documentoResp = await fetch(`https://sandbox.clicksign.com/api/v1/documents`, {
            method: 'POST',
            headers: options.headers,
            body: bodyDocumento
        })

        if (!documentoResp.ok) {
            const errorBody = await documentoResp.text();
            logger.error("Erro ao criar documento:", documentoResp.status, errorBody);
            return {
                success: false,
                error: `Erro na criação do documento: ${documentoResp.status}`
            }
        }

        const docData = await documentoResp.json();
        const DOCUMENT_KEY = docData.document?.key;
        logger.info("Documento criado com sucesso:", DOCUMENT_KEY);

        if (!DOCUMENT_KEY) {
            return {
                success: false,
                error: "Não encontrou DOCUMENT_KEY"
            };
        }

        let signatariosCriados = []
        let docsFinalizado = false;

        // corpo do signatário - funcionando tb
        for (const signatario of signatarios) {
            try {
                const bodySignatario = JSON.stringify({
                    "signer": {
                        "email": signatario.email,
                        "name": signatario.name,
                        "auths": ["email"]
                    }
                });

                // cria signatarios
                const respSign = await fetch(`https://sandbox.clicksign.com/api/v1/signers`, {
                    method: 'POST',
                    headers: options.headers,
                    body: bodySignatario
                });

                if (!respSign.ok) {
                    logger.error(`Erro ao criar signatário ${signatario.email}, ${respSign.status}`, respSignatarioTexto);
                    continue;
                }

                const respSignatario = await respSign.json()
                const SIGNER_KEY = respSignatario.signer?.key;

                if (!SIGNER_KEY) {
                    logger.warn("SIGNER_KEY não foi encontrado para:", signatario.email)
                    continue;
                }

                let adicionaSignatario = false;

                try {
                    // corpo para enviar para a assinatura
                    const bodyLista = JSON.stringify({
                        "list": {
                            "document_key": DOCUMENT_KEY,
                            "signer_key": SIGNER_KEY,
                            "sign_as": "sign",
                            "message": ""
                        }
                    });

                    const respLista = await fetch(`https://sandbox.clicksign.com/api/v1/lists`, {
                        method: 'POST',
                        headers: options.headers,
                        body: bodyLista
                    });

                    adicionaSignatario = respLista.ok;

                    if (!adicionaSignatario) {
                        logger.warn(`Signatário ${signatario.email} criado, mas não adicionado`)
                    }

                } catch (listaError) {
                    logger.warn(`Erro ao adicionar ${signatario.email} na lista: `, listaError.message)
                }

                signatariosCriados.push({
                    email: signatario.email,
                    name: signatario.name,
                    key: SIGNER_KEY,
                    adicionadoAoDocumento: adicionaSignatario,
                    signingUrl: `https://sandbox.clicksign.com/documents/${DOCUMENT_KEY}?signer=${SIGNER_KEY}`
                });

                logger.info(`Signatário processado: ${signatario.name}`, {
                    adicionado: adicionaSignatario
                });

            } catch (signatarioError) {
                logger.error(`Erro ao processar signatário ${signatario.email}`, signatarioError)
            }
        }
        

        try {
            // finaliza recursos e assinatura
            const bodyFinalizar = JSON.stringify({
                "document": {
                    "auto_close": true
                }
            });

            const respFinalizar = await fetch(`https://sandbox.clicksign.com/api/v1/documents/${DOCUMENT_KEY}/finalize`, {
                method: 'PATCH',
                headers: options.headers,
                body: bodyFinalizar
            })

            docsFinalizado = respFinalizar.ok;

        } catch (finalizarError) {
            logger.warn("Erro ao finalizar documento:", finalizarError.message);
        }
        return {
            success: true,
            documentKey: DOCUMENT_KEY,
            signatarios: signatariosCriados,
            documentUrl: `https://sandbox.clicksign.com/documents/${DOCUMENT_KEY}`,
            message: "Documento criado e signatários adicionados!",
            metadata: {
                totalSignatarios: signatarios.length,
                signatariosProcessados: signatariosCriados.length,
                documentoFinalizado: docsFinalizado
            }
        };
    } catch (error) {
        logger.error('Erro na integração Clicksign:', error);
        return {
            success: false,
            error: "Erro ao processar solicitação de assinatura"
        };
    }
}

module.exports = { enviarParaAssinatura }