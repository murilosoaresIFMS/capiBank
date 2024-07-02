// FORMATA CPF E TELEFONE

export function DataFormatter() {

    const CPF = (e) => {

        var value = e.target.value
        var caret = e.target.selectionStart
        var previousValue = e.target.previousValue
    
        if (value + "-" === previousValue || value + "." === previousValue) {
            if (caret === 3 && value.substring(3, 4) !== ".") {
                var prefix = value.substring(0, 2)
                var suffix = value.substring(3)
                value = prefix + suffix
                caret--
            } else if (caret === 7 && value.substring(7, 8) !== ".") {
                var prefix = value.substring(0, 6)
                var suffix = value.substring(7)
                value = prefix + suffix
                caret--
            } else if (caret === 11 && value.substring(11, 12) !== "-") {
                var prefix = value.substring(0, 10)
                var suffix = value.substring(11)
                value = prefix + suffix
                caret--
            }
        }
    
        for (var i = value.length - 1; i >= 0; i--) {
            var char = value[i]
            if (char >= "0" && char <= "9") {
                continue
            }
    
            var prefix = value.substring(0, i)
            var suffix = value.substring(i + 1)
            value = prefix + suffix
            if (caret > i) {
                caret--
            }
        }
    
        if (value.length > 11) {
            value = value.substring(0, 11)
        }
    
        if (value.length >= 3) {
            var prefix = value.substring(0, 3)
            var suffix = value.substring(3)
            value = prefix + "." + suffix
            if (caret >= 3) {
                caret++
            }
        }
    
        if (value.length >= 7) {
            var prefix = value.substring(0, 7)
            var suffix = value.substring(7)
            value = prefix + "." + suffix
            if (caret >= 7) {
                caret++
            }
        }
    
        if (value.length >= 11) {
            var prefix = value.substring(0, 11)
            var suffix = value.substring(11)
            value = prefix + "-" + suffix
            if (caret >= 11) {
                caret++
            }
        }
    
        e.target.value = value
        e.target.selectionStart = caret
        e.target.selectionEnd = caret
        e.target.previousValue = value
    }

    const phone = (e) => {
        var value = e.target.value.replace(/\D/g, '') // Remove todos os caracteres não numéricos
        var caret = e.target.selectionStart
        var previousValue = e.target.previousValue || ''
    
        if (value.length > 11) {
            value = value.substring(0, 11)
        }
    
        if (value.length > 2) {
            value = '(' + value.substring(0, 2) + ') ' + value.substring(2)
            if (caret > 2) caret += 2
        }
    
        if (value.length > 9) {
            value = value.substring(0, 9) + '-' + value.substring(9)
            if (caret > 9) caret += 1
        }
    
        e.target.value = value
        e.target.selectionStart = caret
        e.target.selectionEnd = caret
        e.target.previousValue = value
    }

    return {CPF, phone}
}

// VALIDA O FORMULÁRIO

export function DataValidator() {

    const checkRelation = (input, relation) => {
        relation.forEach((relation) => {
            if (relation.id == input.id) {
                lookForErrors(relation, input)
            }
        })
    }

    const toggleSubmit = (submit, Inputs) => {

        submit.disabled = true
        var emptyInputs = 0
        var InvalidInputs = 0

        // Procura algum input vazio ou inválido 
        Inputs.forEach((box) => {
            const input = box.firstElementChild
            if (input.value.length == 0) {
                emptyInputs += 1
            }
            if (box.className.includes('Invalid')) {
                InvalidInputs += 1
            }
        })
        console.log(emptyInputs, InvalidInputs)
        // Ativa o botão se todos os inputs estiverem preenchidos e válidos
        if (emptyInputs == 0 && InvalidInputs == 0) { submit.disabled = false }

    }


function lookForErrors(relation, input) {
    const box = input.parentElement
    const errorPanel = errorController()

    const matchingInput = document.querySelector(`#${relation.mustMatch}`)

    if (input.value.length < relation.minimum) {
        errorPanel.showError(box, relation, `${input.id} precisa ter no mínimo ${relation.minimum} caracteres!`)
    }

    else if (!relation.requiredString.every(str => input.value.includes(str))) {
        errorPanel.showError(box, relation, `${input.id} precisa incluir ${relation.requiredString.join(" ou ")} em seu corpo!`)
    }

    else if (relation.mustMatch && matchingInput.value !== input.value) {
        errorPanel.showError(box, relation, `Os campos de senha não coincidem!`)
    }

    else if (relation.regex !== null && relation.regex.test(input.value)) {
        errorPanel.showError(box, relation, `Campo não pode possuir caracteres consecutivos!`)
    }

    else {
        errorPanel.hideError(box, relation)
    }
}

// Painel de erro, exibe a mensagem e deixa o campo inválido. Também esconde o erro
function errorController() {

    const message = document.querySelectorAll('.Error-Message')

    const showError = (box, relation, msg) => {
        message[relation.position].textContent = msg
        box.classList.add('Invalid')
    }

    const hideError = (box, relation) => {
        message[relation.position].textContent = ''
        box.classList.remove('Invalid')
    }

    return { showError, hideError }
}

    return { checkRelation, toggleSubmit }
}


