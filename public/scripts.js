const cards = document.querySelectorAll('.card')


for (let i = 0;cards.length; i++){
    cards[i].addEventListener('click', function () {
        window.location.href = `/details_recipes/${i}` 
    })
}

