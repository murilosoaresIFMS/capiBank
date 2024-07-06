import { renderData } from "../modules/renderData.js"
import { DataValidator } from "../modules/formDealer.js"

const relation = [
    { id: "email", position: 0, minimum: 3, requiredString: [".com", "@"], mustMatch: null, regex: null},
]

function validateForm() {

    const Inputs = document.querySelectorAll('.Input')
    const submit = document.querySelector('#submit-1')
    
    const validate = DataValidator()
    validate.toggleSubmit(submit, Inputs)

    Inputs.forEach((box) => {
        let input = box.firstElementChild

        input.addEventListener('input', (e) => {
            validate.checkRelation(input, relation)
            validate.toggleSubmit(submit, Inputs)
            if (input.id == 'cpf') { format.CPF(e) }
        })
    })
    
    submit.addEventListener('click', (e) => {
        e.preventDefault()
        const form = document.querySelector('.Forgot-PWD')
        sendFormData(form)
    })

}

function sendFormData(form) {
    
    toggleSubmit('deact')
    toggleLoader('activate')

    let formData = new FormData(form)
    let render = renderData()

    let userData = { "email": formData.get("email"), type : 'send_email' } 
    
    let requestOptions = {
        method: 'POST',
        body: JSON.stringify(userData)
    }
    
    fetch('http://localhost:8080/sendData', requestOptions).then(async (check_email) => {

        toggleLoader('deact')
        const result = await check_email.json()

        if (check_email.status == 200) { 
            toggleForm('deact')
            render.outcome(result.message)
        }
        else {
            toggleSubmit('activate')
            render.outcome(result.message)
        }

    }).catch((err) => {
        console.log(err)
    })
  
}  

function toggleForm(toggle) {

    const form = document.querySelector('.Forgot-PWD')
    const label = document.querySelector('#email-label')
    const elements = form.elements;

    if (toggle == 'deact') {
        label.style.opacity = 0.5
        elements[0].disabled = true        
    }
    else {
        label.style.opacity = 0.1
        elements[0].disabled = false        
    }

}

function toggleSubmit(toggle) {
    const submit = document.querySelector('#submit-1')
    if (toggle == 'deact') {
        submit.disabled = true
    }
    else {
        submit.disabled = false
    }
}

function toggleLoader(toggle) {
    const loading = document.querySelector('#loading')

    if (toggle == 'deact') {
        loading.style.display = 'none'
    }
    else {
        loading.style.display = 'block'
    }
}

document.addEventListener('DOMContentLoaded', validateForm)