const { URL } = require("url");
const validarurl = (req,res,next)=>{
    try {
        const { origin} = req.body;
        const urlFrontend = new URL(origin);
        if (urlFrontend.origin !== "null"){
            if(urlFrontend.protocol === "http:"||
            urlFrontend.protocol === "https:"){

            return next();}
            throw new Error("Error debe ser http o https");
        }
        else{
           
        }
        
    } catch (error) {
        
        
            req.flash("mensajes",[{msg:error.message}]);
        
        return res.redirect('/');
    }


}

module.exports = validarurl;