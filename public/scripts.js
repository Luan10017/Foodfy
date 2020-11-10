const buttons = document.querySelectorAll('.show-button') 
const content = document.querySelectorAll('.content')

/* DETAILS RECIPE - MOSTRA / ESCONDE */
for (let [i,button] of buttons.entries()) {
    button.addEventListener('click', () => {
        if(content[i].classList.contains("show")){
            content[i].classList.remove('show')
            content[i].classList.add('hide')
            button.innerHTML= "Mostrar"
            
        } else {
            content[i].classList.add('show')
            content[i].classList.remove('hide')
            button.innerHTML= "Esconder"
        }
    })  
}


const currentPage = location.pathname
const menuItens = document.querySelectorAll("header .container nav .links a")

console.log(currentPage, menuItens)
for (item of menuItens) {
    if(currentPage.includes(item.getAttribute("href"))) {
        item.classList.add("active")
    }
}

/* CONTROLE DELETE */
const formDelete = document.querySelector("#form-delete")
if (formDelete) {
    formDelete.addEventListener("submit", function (event) {
        const confirmation = confirm("Deseja Deletar?")
        if (!confirmation) {
            event.preventDefault()
        }
    })
}