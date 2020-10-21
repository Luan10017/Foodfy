/* const cards = document.querySelectorAll('.card') */
const buttons = document.querySelectorAll('.button') 
const content = document.querySelectorAll('.content')


/* REDIRECIONAMENTO CARDS PARA DETALHES*/
/* for (let i = 0;cards.length; i++){
    cards[i].addEventListener('click', function () {
        window.location.href = `/details_recipes/${req.body.id}` 
    })
} */


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
const menuItens = document.querySelectorAll("header nav .links a")

console.log(currentPage)
for (item of menuItens) {
    if(currentPage.includes(item.getAttribute("href"))) {
        item.classList.add("active")
    }
}