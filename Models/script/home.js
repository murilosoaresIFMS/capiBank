import { getUserData } from '../modules/Cliente.js'
import { renderData } from '../modules/renderData.js'
import { ProtectRoute } from '../modules/ProtectRoute.js'
import { DataValidator, DataFormatter } from '../modules/formDealer.js'


async function DOMInteraction() {

    const body = document.querySelector('.container')

    const render = renderData()
    const data = getUserData()

        .then((user) => {
            render.name(user.nome)
            render.saldo('R$ ' + user.saldo)
            interactionMenu()
            toggleDialogue()
        })

        .catch((err) => {
            ProtectRoute()
            console.log(err)
        })

}

function interactionMenu() {

    const open = document.querySelector('.bx-log-out-circle')
    let is_open = false

    function abrirMenu() {
        document.getElementById("menu").style.width = "250px";
        document.getElementById("barra").style.marginLeft = "265px"
        document.getElementById("conteudo-1").style.marginLeft = "265px"
    }

    function fecharMenu() {
        document.getElementById("menu").style.width = "50px";
        document.getElementById("barra").style.marginLeft = "65px"
        document.getElementById("conteudo-1").style.marginLeft = "65px"
    }

    open.addEventListener('click', () => {

        if (is_open) {
            fecharMenu()
            is_open = false
            return
        }

        abrirMenu()
        is_open = true

    })
}

function toggleDialogue() {
    const button = document.querySelector('#t-button')
    const dialogue = document.querySelector('.Dialog')
    button.addEventListener('click', () => {
        dialogue.classList.toggle('Open')
        transferOperation()
    })
}

function transferOperation() {

    const relation = [
        { id: "cpf", position: 0, minimum: 14, requiredString: [], mustMatch: null, regex: null}
    ]

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
            const confirm_form = document.querySelector('#confirm_transfer')

            if (check_cpf.status == 200) {
                render.outcome(`CPF encontrado! Deseja fazer a transferência de R$ ${userData.value} para ${result.message}?`)
                toggleForm(confirm_form)
                return
            }

            render.outcome(result.message)
            hideForm(confirm_form)

        })

            .catch((err) => {
                console.log(err)
            })
    }

    function toggleForm(form) {
        form.classList.add('open')
        getConfirmAnswer()
    }

    function hideForm(form) {
        form.classList.remove('open')
    }

    function getConfirmAnswer() {

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

        fetch('http://localhost:8080/sendData', requestOptions).then(async (response) => {

            const result = await response.json()
            console.log(result.message)
            alert(result.message.logged + result.message.transfer + result.message.cash)

        })

    }

    formInteraction()

}






document.addEventListener('DOMContentLoaded', DOMInteraction)