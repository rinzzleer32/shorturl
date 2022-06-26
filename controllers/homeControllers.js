
const URL = require('../models/Url');
const {nanoid} = require('nanoid');



const leerUrl = async(req,res) =>{
    try {
        const urls = await URL.find({user: req.user.id}).lean();
        res.render("home",{urls: urls})
    } catch (error) {
        req.flash("mensajes",[{msg:error.message}]);
        return res.redirect('/');
    }
    
};

const agregarURL = async(req,res) =>{   
    
    const {origin} = req.body;

    try {
        const url = new URL({origin: origin, shortURL: nanoid(8), user: req.user.id});
        await url.save();
        req.flash("mensajes",[{msg:"Url agregada"}]);
        res.redirect('/');
    } catch (error) {
        req.flash("mensajes",[{msg:error.message}]);
        return res.redirect('/');
    }
};

const eliminarUrl = async(req,res) =>{
    const {id} = req.params;
    try {
       // await URL.findByIdAndDelete(id);
       const url = await URL.findById(id);
       if(!url.user.equals(req.user.id)){
         throw new Error("No es tu url")
       }
       await url.remove();
       req.flash("mensajes",[{msg:"Url eliminida"}]);
        res.redirect("/");

    } catch (error) {
        req.flash("mensajes",[{msg:error.message}]);
        return res.redirect('/');
    }
}

const editarURLForm = async(req,res)=>{
    const {id} = req.params;
    try {
        const url = await URL.findById(id).lean();
        if(!url.user.equals(req.user.id)){
            throw new Error("No es tu url")
          }
        res.render('home',{url});
    } catch (error) {
        req.flash("mensajes",[{msg:error.message}]);
        return res.redirect('/');
    }
}
const editarURL = async(req,res)=>{
    const {id} = req.params;
    const {origin} = req.body;
    try {
        const url = await URL.findById(id);
        if(!url.user.equals(req.user.id)){
          throw new Error("No es tu url")
          }
          req.flash("mensajes",[{msg:"url editada"}]);
           await url.updateOne({origin}) ;
       //await URL.findByIdAndUpdate(id,{origin: origin});
        res.redirect('/');
    } catch (error) {
        req.flash("mensajes",[{msg:error.message}]);
        return res.redirect('/');
    }
}

const redireccionamiento = async(req,res)=>{
    const {shortURL} = req.params;
    try {
        const urlDB = await URL.findOne({shortURL: shortURL});
        res.redirect(urlDB.origin);
    } catch (error) {
        req.flash("mensajes",[{msg:"no existe la url de direccionamiento"}]);
        return res.redirect('/auth/login');
    }

}
module.exports = {
    leerUrl,
    agregarURL,
    eliminarUrl,
    editarURLForm,
    editarURL,
    redireccionamiento,
}