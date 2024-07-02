import { getUserData } from '../modules/Cliente.js'
import { renderData } from '../modules/renderData.js'
import { ProtectRoute } from '../modules/ProtectRoute.js'

async function DOMInteraction() {

    const body = document.querySelector('.container')
    
    const render = renderData()
    const data = getUserData()

    .then((user) => {
        render.name(user.nome)
        //render.select(user.id)
        //toggleDialogue() // PRECISA CRIAR CAIXA DE DIÁLOGO NO HTML
        abrirMenu()
        fecharMenu()
    })

    .catch((err) => {
        //ProtectRoute()
        console.log(err)
    })

}

// Caixa para realizar operações
/*
function toggleDialogue() {
    const button = document.querySelector('#t-button')
    const dialogue = document.querySelector('.Dialog')
    button.addEventListener('click', () => {
        dialogue.classList.toggle('Open')
    })
}
*/

    

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

document.addEventListener('DOMContentLoaded', DOMInteraction)