
console.log("mensaje front end");

document.addEventListener("click", (e)=>{
    if(e.target.dataset.short){
        const url = `${window.location.origin}/${e.target.dataset.short}`

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