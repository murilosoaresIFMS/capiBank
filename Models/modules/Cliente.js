
// Aqui é realizado o FETCH para extrair informações do banco e renderizar na DOM.
    // Por conveniência, esses dados são armazenados como atributos de um objeto e são repassados para
    // uma função auxiliar (no script renderData.js) que recebe esses dados e renderiza eles nos campos.


// MUDANÇA: Inclusão do saldo como atributo do Cliente

// Aqui é realizado o FETCH para extrair informações do banco e renderizar na DOM.
    // Por conveniência, esses dados são armazenados como atributos de um objeto e são repassados para
    // uma função auxiliar (no script renderData.js) que recebe esses dados e renderiza eles nos campos.
export class Cliente {
    constructor (nome, cpf, email, telefone, senha, saldo) {
        this.nome = nome
        this.cpf = cpf
        this.email = email
        this.telefone = telefone
        this.senha = senha
        this.saldo = saldo
    }
}

export async function getUserData() {

    async function getUser() {
        
        const response = await fetch('http://localhost:8080/api/user')
        const database = await response.json()
        console.log(database)
        return new Cliente(database.id, database.nome, database.cpf, database.email, database.telefone, database.senha)
    
    }

    const userData = await getUser()
    return userData // Retorno de um dado assíncrono (objeto contendo os dados do usuário)
}


