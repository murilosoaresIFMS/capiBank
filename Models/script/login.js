import {renderData} from '../modules/renderData.js'
import { DataFormatter } from '../modules/formDealer.js'
import { DataValidator } from '../modules/formDealer.js'
import { ProtectRoute } from '../modules/ProtectRoute.js'

const relation = [
    { id: "cpf", position: 0, minimum: 14, requiredString: [], mustMatch: null, regex: null},
    { id: "senha", position: 1, minimum: 6, requiredString: [], mustMatch: null, regex: null }
]

function validateForm() {

    const Inputs = document.querySelectorAll('.Inputs')
    const submit = document.querySelector('#submit')

    const format = DataFormatter()
    const validate = DataValidator()

    validate.toggleSubmit(submit, Inputs)

    Inputs.forEach((box) => {
        const input = box.firstElementChild
        
        input.addEventListener('input', (e) => {
            if (input.id == 'cpf') { format.CPF(e) }
            validate.checkRelation(input, relation)
            validate.toggleSubmit(submit, Inputs)
        })

    })

    sendFormData()
}

function sendFormData() {
    
    const form = document.querySelector('form')
    const render = renderData()
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        let formData = new FormData(form)

        let userData = {
            'cpf': formData.get('cpf'),
            'senha': formData.get('senha')
        }

        let requestOptions = {
            method: 'POST',
            body: JSON.stringify(userData)
        }
        console.log(form, requestOptions)
        fetch('http://localhost:8080/validateData', requestOptions).then( async (response) => {

            if (response.status == 200) {
                window.location.href = './home.html'
                return
            }
            
            const error = await response.json()
            window.alert(error.message)
            form.reset()
            
        })
         
        
    })
      
}
/*
function forgetPWD() {
    const forgot_pwd = document.querySelector("#forgot-pwd")
    forgot_pwd.addEventListener('click', () => {
        window.location.href = "./esqueci-senha.html"
    })
}
*/

document.addEventListener('DOMContentLoaded', validateForm)
//document.addEventListener('DOMContentLoaded', forgetPWD)