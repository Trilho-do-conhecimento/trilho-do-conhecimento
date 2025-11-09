const { error } = require('winston');

require('dotenv').config();
const ACCESS_TOKEN_API = process.env.CLICKSIGN_TOKEN;
const URL_API = `https://sandbox.clicksign.com/api/v3/envelopes?access_token=${ACCESS_TOKEN_API}`
const URL_BASE_ENVELOPES = "https://sandbox.clicksign.com/api/v3/envelopes"
const ENVELOPE_ID = 'df916589-3bb9-4b7b-a585-fb6b853b0554'
const URL_ALTERA_ENVELOPES = `https://sandbox.clicksign.com/api/v3/envelopes/${ENVELOPE_ID}`
const URL_DOCUMENTOS = `https://sandbox.clicksign.com/api/v3/envelopes/${ENVELOPE_ID}/documents`

const options = {
    headers: {
        'accept': 'application/json',
        'Authorization': `${ACCESS_TOKEN_API}`,
        'content-type': 'application/vnd.api+json'
    }
}

async function listaEnvelope() {
    const resp = await fetch(URL_BASE_ENVELOPES, {
        method: 'GET',
        headers: options.headers
    })
        .then(res => res.json())
        .then(res => console.log(res))
        .catch(err => console.log(err));
}

async function criaEnvelope() {
    const body = '\n{\n"data": {\n"type": "envelopes",\n"attributes": {\n"name": "Envelope de Teste",\n"locale": "pt-BR",\n"auto_close": true,\n"remind_interval": "3",\n"block_after_refusal": false\n}\n}\n}\n'
    const resp = await fetch(URL_BASE_ENVELOPES, {
        method: 'POST',
        headers: options.headers,
        body: body
    })
        .then(res => res.json())
        .then(res => console.log(res))
        .catch(err => console.log(err));
}

async function editaEnvelope() {
    const body = JSON.stringify({
        "data" : {
            "type" : "envelopes",
            "id" : ENVELOPE_ID,
            "attributes" : {
                "name" : "Envelope editado no back"
            }
        }
    });

    try {
        const resp = await fetch(URL_ALTERA_ENVELOPES, {
            method: 'PATCH',
            headers: options.headers,
            body: body
        })
    
        console.log("Status: ", resp.status)
    
            if(!resp.ok){
                const errorBody = await resp.text()  
                console.error("erro: ", resp.status)
                console.log("mensagem da api: ", errorBody)
                return 
            }

            const data = await resp.json()
            console.log("Sucesso! Envelope editado.")
            console.log("Envelope: ", data.data.id, "-", data.data.attributes.name)

    } catch (err) {
        console.error("Erro ao tentar editar o envelope: ", err.message || err)
    }
}

async function exibeDetalhesEnvelope() {
    const resp = await fetch(URL_ALTERA_ENVELOPES, {
        method: 'GET',
        headers: options.headers
    })

    .then(res => res.json())
    .then(res => console.log(res))
    .catch(err => console.log(err));
}

async function deletaEnvelope() {
    try{
        const resp = await fetch(URL_ALTERA_ENVELOPES, {
            method: 'DELETE',
            headers: options.headers
        })
    
        if(!resp.ok){
            const errorDel = await resp.text()
            console.log("Erro:", resp.status)
            console.log("Mensagem da API:", errorDel)
            return;
        }
        
        if(resp.status === 204) {
            console.log("Sucesso! Envelope deletado") 
            return;  
        }

        if(resp.ok){ 
            const data = await resp.json()
            console.log("Sucesso! Envelope deletado.")
            console.log("Envelope:", data.data.id, "-", data.data.attributes.name);
        }

    } catch (err) {
        console.error("Erro ao tentar deletar envelope:", err.message || err)
    }
}

// listaEnvelope();
// criaEnvelope();
// editaEnvelope();
// exibeDetalhesEnvelope();
// deletaEnvelope();
