import { renderData } from '../modules/renderData.js'
import { DataFormatter } from '../modules/formDealer.js'
import { DataValidator } from '../modules/formDealer.js'

// Relação entre o ID dos inputs e a posição deles no array de .Inputs 

const relation = [
    { id: "nome", position: 0, minimum: 3, requiredString: [], mustMatch: null, regex: /(\w)\1{2,}/ },
    { id: "cpf", position: 1, minimum: 14, requiredString: [], mustMatch: null, regex: null},
    { id: "email", position: 2, minimum: 3, requiredString: [".com", "@"], mustMatch: null, regex: null },
    { id: "telefone", position: 3, minimum: 14, requiredString: [], mustMatch: null, regex: null },
    { id: "data_nascimento", position: 4, minimum: 10, requiredString: [], mustMatch: null, regex: null },
    { id: "senha", position: 5, minimum: 6, requiredString: [], mustMatch: 'confirmar-senha', regex: null },
    { id: "confirmar-senha", position: 6, minimum: 6, requiredString: [], mustMatch: 'senha', regex: null }
]

// Função principal
function validateForm() {

    const Inputs = document.querySelectorAll('.Inputs')
    const submit = document.querySelector('#submit')
    //const bx = document.querySelectorAll('.bx')
    
    const format = DataFormatter()
    const validate = DataValidator()
    
    validate.toggleSubmit(submit, Inputs)
    
    Inputs.forEach((box) => {

        const input = box.firstElementChild 
        // Verifica erros em todos os inputs
        input.addEventListener('input', (e) => {
            validate.checkRelation(input, relation)
            validate.toggleSubmit(submit, Inputs)
            if (input.id == 'cpf') { format.CPF(e) }
            if (input.id == 'telefone') { format.phone(e) }
        })
        /*
        input.addEventListener('blur', () => {
            validate.checkRelation(input, relation)
            validate.toggleSubmit(submit, Inputs)
        })
        
        input.addEventListener('focus', () => {
            validate.checkRelation(input, relation)            
            validate.toggleSubmit(submit, Inputs)
        })
        */
       /*
        bx.forEach((check) => {
            check.addEventListener('click', () => {
                check.classList.toggle('show')
                let showPassword = (input.type == 'password' ? 'text' : 'password')
                if (input.id == 'senha' && check.id == 'p1') { input.type = showPassword }
                if (input.id == 'confirmar-senha' && check.id == 'p2') { input.type = showPassword }
            })
        })
        */
    })

    submit.addEventListener('click', (e) => {
        e.preventDefault()
        const form = document.querySelector('form')
        sendFormData(form)
    })

}

 

// Envia as informações para servidor
function sendFormData(form) {

    const render = renderData()
    let formData = new FormData(form)

    let userData = {
        'nome': formData.get('nome'),
        'cpf': formData.get('cpf'),
        'email': formData.get('email'),
        'telefone': formData.get('telefone'),
        'data_nascimento': formData.get('data_nascimento'),
        'senha': formData.get('senha'),
    }

    let requestOptions = {
        method: 'POST',
        body: JSON.stringify(userData)
    }

    fetch('http://localhost:8080/saveData', requestOptions).then(async (response) => {

        const result = await response.json()
        
        form.reset()

        if (response.status == 200) { 
            alert ("Conta cadastrada")
            return
        }

        alert(result.message)

    })

}

document.addEventListener('DOMContentLoaded', validateForm)
