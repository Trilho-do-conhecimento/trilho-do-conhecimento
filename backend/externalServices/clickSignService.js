require('dotenv').config();
const ACCESS_TOKEN_API = process.env.CLICKSIGN_TOKEN;
const { error } = require('winston');
const logger = require('../logs/logger')

const options = {
    headers: {
        'accept': 'application/json',
        'Authorization': ACCESS_TOKEN_API,
        'content-type': 'application/vnd.api+json'
    }
}

async function enviarParaAssinatura(fileBase64, filename, signatarios) {
    console.log("Token API:", ACCESS_TOKEN_API ? "ok" : "token vazio");

    try {

        const bodyEnvelope = JSON.stringify({
            "data": {
                "type": "envelopes",
                "attributes": {
                    "name": filename,
                    "locale": "pt-BR",
                    "auto_close": true
                }
            }
        });

        const envelopeResp = await fetch(`https://sandbox.clicksign.com/api/v3/envelopes`, {
            method: 'POST',
            headers: options.headers,
            body: bodyEnvelope
        });

        if (!envelopeResp.ok) {
            const errorBody = await envelopeResp.text();
            logger.error("Erro ao criar envelope:", envelopeResp.status, errorBody);
            return {
                success: false,
                error: `Erro na criação do envelope: ${envelopeResp.status}`
            }
        }

        const envelopeData = await envelopeResp.json();
        const ENVELOPE_ID = envelopeData.data?.id;
        if (!ENVELOPE_ID) {
            logger.error("ENVELOPE_ID não encontrado: ", envelopeData)
            return {
                success: false,
                error: "Envelope ID não retornado pela API"
            }
        }
        logger.info("Envelope criado com sucesso:", ENVELOPE_ID);

        if (!ENVELOPE_ID) {
            return {
                success: false,
                error: "Não encontrou ENVELOPE_ID"
            };
        }

        const bodyDocumento = JSON.stringify({
            "data": {
                "type": "documents",
                "attributes": {
                    "filename": filename,
                    "content_base64": fileBase64
                }
            }
        });

        const documentoResp = await fetch(`https://sandbox.clicksign.com/api/v3/envelopes/${ENVELOPE_ID}/documents`, {
            method: 'POST',
            headers: options.headers,
            body: bodyDocumento
        });

        if (!documentoResp.ok) {
            const errorBody = await documentoResp.text();
            logger.error("Erro ao adicionar documento ao envelope:", documentoResp.status, errorBody);
            return {
                success: false,
                error: `Erro no documento: ${documentoResp.status}`
            }
        }

        const docData = await documentoResp.json()
        logger.info("Documento adicionado!", docData)

        let signatariosCriados = [];

        for (const signatario of signatarios) {
            const bodySignatario = JSON.stringify({
                "data": {
                    "type": "signers",
                    "attributes": {
                        "email": signatario.email,
                        "name": signatario.name,
                        "has_documentation": true
                    }
                }
            });

            const respSign = await fetch(`https://sandbox.clicksign.com/api/v3/envelopes/${ENVELOPE_ID}/signers`, {
                method: 'POST',
                headers: options.headers,
                body: bodySignatario
            });

            if (respSign.ok) {
                const signerData = await respSign.json();
                const SIGNER_ID = signerData.data?.id;

                signatariosCriados.push({
                    email: signatario.email,
                    name: signatario.name,
                    id: SIGNER_ID,
                    url: `https://sandbox.clicksign.com/documents/${ENVELOPE_ID}?signer=${SIGNER_ID}`
                });
                logger.info(`Signatário adicionado: ${signatario.name}`);
            } else {
                const error = await respSign.text();
                logger.error("Erro ao criar signatário: ", error)
            }
        }

        logger.info("Concluido!");

        return {
            success: true,
            envelopeId: ENVELOPE_ID,
            signatarios: signatariosCriados,
            documentUrl: `https://sandbox.clicksign.com/documents/${ENVELOPE_ID}`,
            message: "Envelope criado com sucesso! Finalize manualmente no dashboard."
        };

    } catch (error) {
        logger.error('Erro na integração Clicksign v3:', error);
        return {
            success: false,
            error: "Erro ao processar solicitação de assinatura"
        };
    }
}

module.exports = { enviarParaAssinatura }