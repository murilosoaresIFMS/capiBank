
const { createColumn, readColumn, updateColumn } = require('../database/db')

const { sendEmail } = require('../scripts/sendEmail')
const { transferCash, checkCPF } = require('./transferOp')
const { getError } = require('./getError')

function getResponse() {

    const saveData = async (data, res) => {
        const operation = await createColumn(data, `INSERT INTO dados_clientes (nome, cpf, email, telefone, data_nascimento, senha) VALUES ($1, $2, $3, $4, $5, $6)`).catch((err) => { console.log(err) })
        const response = operation.outcome == 400 ? getError(operation.error) : 'Cadastro concluído com sucesso!'
        res.writeHead(operation.outcome, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
        res.end(JSON.stringify({
            message: response
        }))
    }

    const validateData = async (data, res) => {

        const database = await readColumn('SELECT id, cpf, senha FROM dados_clientes').catch((err) => { console.log(err) })
        const userData = database.rows
        
        let is_user_found
        let id

        for (i = 0; i < userData.length; i++) {
            const user = userData[i]
            if (user.cpf == data.cpf && user.senha == data.senha) {
                is_user_found = true
                id = user.id
                break
            }

        }

        outcome = (is_user_found) ? 200 : 400
        const response = (is_user_found) ? '' : 'ID ou senha inválidos!'

        res.writeHead(outcome, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })

        res.end(JSON.stringify({
            message: response
        }))

        if (is_user_found) { return id }

    }

    const updateData = async (data, res, fetchID) => {

        let id = fetchID()
        
        for (key in data) {

            const operation = await updateColumn(`UPDATE dados_clientes SET ${key} = $1 WHERE id = $2`, [data[key], id])
            const outcome = operation.outcome
            const response = operation.outcome == 400 ? getError(operation.error) : 'Cadastro concluído com sucesso!'

            res.writeHead(outcome, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
            res.end(JSON.stringify({
                message: response
            }))

        }
    }

    const sendData = (data, res, fetchID) => {
        
        let operation 
        
        if (data.type == 'send_email') {
            operation = sendEmail(data.email)
        }
        
        else if (data.type == 'check_cpf') {
            operation = checkCPF(data.cpf, fetchID)
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