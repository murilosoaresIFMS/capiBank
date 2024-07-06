const http = require('http')

const { createTable, readColumn } = require('./database/db')

const { getBody } = require('./scripts/getBody')
const { getResponse } = require("./scripts/getResponse")

let fetchID

const server = http.createServer( async (req, res) => {

    if (req.url.includes('Data')) {

        let body = await getBody(req).catch((err) => console.log(err)) 
        let data = JSON.parse(body)
        
        let response = getResponse()

        if (req.url == '/saveData') {
            response.saveData(data, res)
        }
        
        else if (req.url == '/validateData') {
            const id = await response.validateData(data, res)
            fetchID = () =>  { return id }
        }

        else if (req.url == '/updateData') {
            response.updateData(data, res, fetchID)
        }

        else if (req.url == '/sendData') {
            response.sendData(data, res, fetchID)
        }
 
    }

    if (typeof(fetchID) == 'function' && (req.url.includes('api'))) {

        let id = fetchID()
        let query 
        
        if (req.url == '/api/users') {
            query = 'SELECT id, nome FROM dados_clientes'
        }

        else if (req.url == '/api/user') {
            query = `SELECT * FROM dados_clientes WHERE id = ${id}`
        }
         
        const database = await readColumn(query)
        const userData = database.rows[0]

        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'})
        res.end(JSON.stringify(userData))

    }
    

})

createTable().then(isConnected => {

    if (!isConnected) {
        console.log('Não foi possível conectar ao banco de dados. O servidor não será iniciado. Certifique se as credenciais estão corretas.')
        return
    }

    console.log('Conexão com o banco de dados estabelecida. Tabela dados_clientes criada. Iniciando o servidor...');
    server.listen(8080, 'localhost', () => {
        console.log('Servidor rodando na porta 8080')
    })

})