const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('#complete')

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteBook)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', complete)
})

// Array.from(itemCompleted).forEach((element)=>{
//     element.addEventListener('click', markUnComplete)
// })

async function complete(){
    let itemText = this.parentNode.childNodes[1].innerText
    itemText = itemText.split(',')[0];
    try{
        const response = await fetch('completed', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function deleteBook() {
    let bookTitle = this.parentNode.childNodes[1].innerText;
    bookTitle = bookTitle.split(',')[0];
    console.log(bookTitle);
    try {
        const response = await fetch('deleteBook', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': (bookTitle.toString())
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    } catch(err) {
        console.log(err);
    }
}
