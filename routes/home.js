const express = require("express");
const router = express.Router();

router.get("/",(req,res) =>{
    const urls =[
        {Origin : "www.google.com", shortURL : "daslda"},
        {Origin : "www.google.com", shortURL : "daslda"},
        {Origin : "www.google.com", shortURL : "daslda"},
    ];
    res.render("home",{urls});
});


module.exports = router;