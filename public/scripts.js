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

/* GERENCIADOR DE IMAGENS */

const PhotosUpload = {
    uploadLimit: 5,
    handleFileInput(event) {
        const { files: fileList } = event.target
        const { uploadLimit } = PhotosUpload

        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return
        }

        Array.from(fileList).forEach(file => {
            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = document.createElement('div')
                div.classList.add('photo')
                div.onclick = () => alert('remover foto')
                div.appendChild(image)

                document.querySelector('#photos-preview').appendChild(div)
            }

            reader.readAsDataURL(file)
        })
    }
}