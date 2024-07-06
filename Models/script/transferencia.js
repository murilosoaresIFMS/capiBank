// Script da transferência, pode ser futuramente colocado no mesmo script do home.js

import { DataValidator, DataFormatter } from '../modules/formDealer.js'
import { renderData } from '../modules/renderData.js'

const relation = [
    { id: "cpf", position: 0, minimum: 14, requiredString: [], mustMatch: null, regex: null}
]

function DOMInteraction() {
    formInteraction()
}

function formInteraction() {

    const Inputs = document.querySelectorAll('.Inputs')
    const submit = document.querySelector('#submit')
    
    const format = DataFormatter()
    const validate = DataValidator()
    
    validate.toggleSubmit(submit, Inputs)
    
    Inputs.forEach((box) => {
        const input = box.firstElementChild 
        input.addEventListener('input', (e) => {
            validate.checkRelation(input, relation)
            validate.toggleSubmit(submit, Inputs)
            if (input.id == 'cpf') { format.CPF(e) }
        })
    })

    submit.addEventListener('click', (e) => {
        e.preventDefault()

        const form = document.querySelector('#check_cpf')
        checkCPF_send(form)
    
    })

}

function checkCPF_send(form) {

    let formData = new FormData(form)
    const render = renderData()

    let userData = {
        'cpf': formData.get('cpf'), 'value': formData.get('value'), 'type': 'check_cpf' 
    }

    let requestOptions = {
        method: 'POST',
        body: JSON.stringify(userData),
    }

    fetch('http://localhost:8080/sendData', requestOptions).then(async (check_cpf) => {

        const result = await check_cpf.json()
        if (check_cpf.status == 200) { 
            render.outcome(`CPF encontrado! Deseja fazer a transferência de R$ ${userData.value} para ${result.message}?`)
            toggleForm() 
            return
        }

        render.outcome(result.message)
        hideForm()

    })
    
    .catch((err) => {
        console.log(err)
    })
}

function toggleForm() {
    const form = document.querySelector('#confirm_transfer')
    form.classList.add('open')
    transferingCash()
}

function hideForm() {
    const form = document.querySelector('#confirm_transfer')
    form.classList.remove('open')
    transferingCash()
}

function transferingCash() {

    const form = document.querySelector('#check_cpf')
    const choice = document.querySelectorAll('.choice')

    choice.forEach((answer) => {

        answer.addEventListener('click', (e) => {
            
            e.preventDefault()

            if (answer.id == 'yes') { 
                transferCash_send(form)
                return 
            }

            if (answer.id == 'no') {
                form.reset()
                window.location.reload()
            }

        })
    })
  
}

function transferCash_send(form) {

    let formData = new FormData(form)
    const render = renderData()

    let userData = {
        'cpf': formData.get('cpf'), 'value': formData.get('value'), 'type': 'transfer_cash' 
    }

    let requestOptions = {
        method: 'POST',
        body: JSON.stringify(userData),
    }

    // Função de transferir com fetch

}


document.addEventListener('DOMContentLoaded', DOMInteraction)