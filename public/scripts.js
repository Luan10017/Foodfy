const cards = document.querySelectorAll('.card')
const buttons = document.querySelectorAll('.button') 
const content = document.querySelectorAll('.content')


/* REDIRECIONAMENTO CARDS PARA DETALHES*/
console.log(cards.length)
for (let i = 0;cards.length; i++){
    cards[i].addEventListener('click', function () {
        window.location.href = `/details_recipes/${i}` 
    })
}


/* DETAILS RECIPE - MOSTRA / ESCONDE */
for (let [i,button] of buttons.entries()) {
    button.addEventListener("click", () => {
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


/* ===  ADMIN INGREDIENT === */

function addIngredient() {
    const ingredients = document.querySelector("#ingredients");
    const fieldContainer = document.querySelectorAll(".ingredient");
  
    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);
  
    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false;
  
    // Deixa o valor do input vazio
    newField.children[0].value = "";
    ingredients.appendChild(newField);
  }
  
const ingredientButton = document.querySelector(".add-button.ingredients")
ingredientButton.addEventListener("click", addIngredient);

/* ===  ADMIN STEPS === */

function addStep() {
    const steps = document.querySelector("#steps");
    const fieldContainer = document.querySelectorAll(".step");
  
    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);
  
    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false;
  
    // Deixa o valor do input vazio
    newField.children[0].value = "";
    steps.appendChild(newField);
  }
  
const stepButton = document.querySelector(".add-button.steps")
stepButton.addEventListener("click", addStep);

