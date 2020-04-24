const modalOverlay = document.querySelector('.modal-overlay');

document.querySelector('.close-modal').addEventListener('click',function(){
    modalOverlay.classList.remove('active')
})
