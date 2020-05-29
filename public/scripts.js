const cards = document.querySelectorAll('.card')


for (let i = 0;cards.length; i++){
    cards[i].addEventListener('click', function () {
        window.location.href = `/details_recipes/${i}` 
    })
}

const ingrediente = document.querySelector('.ingredientes')
const showIng = document.querySelector('.show_ing')

showIng.addEventListener('click', function() {
    if (showIng.innerHTML == 'Esconder') {
        ingrediente.classList.add('active')
        showIng.innerHTML = 'Mostrar'
    }else {
        ingrediente.classList.remove('active')
        showIng.innerHTML = 'Esconder'
    }
})