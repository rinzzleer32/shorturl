
console.log("mensaje front end");

document.addEventListener("click", (e)=>{
    if(e.target.dataset.short){
        const url = `http://localhost:5000/${e.target.dataset.short}`

        navigator.clipboard
        .writeText(url)
        .then(()=>{
            console.log("copiado en el portapapeles");
        })
        .catch((err)=>{
            console.log("Algo esta mal ", err);
        })
    }
})