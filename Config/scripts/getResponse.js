
const { createColumn, readColumn, updateColumn } = require('../database/db')
const { sendEmail } = require('../scripts/sendEmail')
const { transferCash, checkCPF } = require('./transferOp')
const { getError } = require('./getError')

// Funções que interagem com banco e recebem as requisições do "Front-End" e voltam uma resposta para a página
function getResponse() {

    // Função para retornar a resposta com OUTCOME (200/400) e resposta customizada
    function returnResponse(res, outcome, response) {
        res.writeHead(outcome, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
        res.end(JSON.stringify({
            message: response
        }))
    }

    /* ============================================================================================================== */
    // Função para salvar cadastro de usuário
    const saveData = async (data, res) => {
        const operation = await createColumn(data, `INSERT INTO dados_clientes (nome, cpf, email, telefone, data_nascimento, senha) VALUES ($1, $2, $3, $4, $5, $6)`).catch((err) => { console.log(err) })
        const response = operation.outcome == 400 ? getError(operation.error) : 'Cadastro concluído com sucesso!'
        returnResponse(res, operation.outcome, response)
    }

    /* ============================================================================================================== */


    // Função para validar os dados (login). Também retorna ID como forma de "autenticação"
    const validateData = async (data, res) => {

        const database = await readColumn(`SELECT cpf FROM dados_clientes WHERE cpf = '${data.cpf}' AND senha = '${data.senha}'`).catch((err) => { console.log(err) })
        const userData = database.rows

        let is_user_found
        let authentication_id

        if (userData.length > 0) {
            is_user_found = true 
            authentication_id = userData[0].cpf
        }

        const outcome = (is_user_found) ? 200 : 400
        const response = (is_user_found) ? '' : 'ID ou senha inválidos!'

        returnResponse(res, outcome, response)
        if (is_user_found) { return authentication_id }
    }

    // Função para atualizar dados
    const updateData = async (data, res, fetchID) => {

        let id = fetchID()
        
        for (key in data) {

            const operation = await updateColumn(`UPDATE dados_clientes SET ${key} = $1 WHERE id = $2`, [data[key], id])
            const outcome = operation.outcome
            const response = operation.outcome == 400 ? getError(operation.error) : 'Cadastro concluído com sucesso!'

            returnResponse(res, outcome, response)

        }
    }

    // Função para lidar com dados "avulsos", não referentes ao cadastro
    const sendData = (data, res, fetchID) => {
        
        let operation 
        
        if (data.type == 'send_email') {
            operation = sendEmail(data.email)
        }
        
        else if (data.type == 'check_cpf') {
            operation = checkCPF(data.cpf, fetchID)
        }

        else if (data.type == 'transfer_cash') {
            operation = transferCash(data.cpf, fetchID, data.value)
        }

        operation.then((result) => {
            res.writeHead(result.outcome, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
            res.end(JSON.stringify({
                message: result.response
            }))
        })

    }   

    return { saveData, validateData, updateData, sendData }
}


module.exports = { getResponse }