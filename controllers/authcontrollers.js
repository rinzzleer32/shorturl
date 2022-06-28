const User = require("../models/User");
const {validationResult} = require('express-validator');
const flash = require('connect-flash');
const {nanoid} = require ('nanoid');
const nodemailer = require("nodemailer");
require('dotenv').config()
const loginForm = (req,res) =>{
    res.render('login');

}

const registerForm = async(req,res) =>{
    res.render('register')
}

const registerUser = async(req,res) =>{
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        req.flash("mensajes",errors.array())
        return res.redirect('/auth/register')
    }
     const {userName,email,userpassword} =req.body;
    try {

        let user = await User.findOne({email: email})
        if(user) throw new Error('ya existe ese usuario');
        
        user =new User({userName,email, password: userpassword,tokenConfirm: nanoid()});
        //guardar los datos en db
        await user.save(); 
        //enviar correo de confirmacion de la cuenta
        const transport = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: process.env.usermail,
              pass: process.env.passmail
            }
          });

          await transport.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: user.email, // list of receivers
            subject: "Verificacion de la cuenta en url shortner", // Subject line
           
            html: `<a href="${  process.env.PathHeroku ||'http://localhost:5000'}/auth/confirmar/${user.tokenConfirm}">Verifica tu cuenta aqui</a>`, // html body
          });
        req.flash("mensajes",[{msg:"revisa tu correo electronico para validar tu cuenta"}]);
        res.redirect('/auth/login');
    } catch (error) {
        req.flash("mensajes",[{msg:error.message}]);
        return res.redirect('/auth/register');
    }
}

const confirmarCuenta = async(req,res) =>{
    const {token} =req.params;
    try {
       const user = await User.findOne({tokenConfirm:token});
       if(!user) throw new Error('No existe este usuario');
       user.cuentaConfirmada = true;
       user.tokenConfirm = null;
       await user.save();
       req.flash("mensajes",[{msg: "cuenta verificada"}]);
       return res.redirect('/auth/login');
    } catch (error) {
        req.flash("mensajes",[{msg:error.message}]);
        return res.redirect('/auth/login');
    }
}
const loginAccess = async(req,res) =>{
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        req.flash("mensajes",errors.array())
        return res.redirect('/auth/login')
    }
    const {email,pass} = req.body;
    try { 

        const user = await User.findOne({email});
        if(!user) throw new Error('Email invalido');
        if(!user.cuentaConfirmada)throw new Error('Confirmar cuenta primero para poder iniciar sesion');
        if(!await user.comparePassword(pass))throw new Error('Contraseña invalida');

        //iniciar sesion de usuario atraves de passport
        req.login(user,function(err){
            if(err) throw new Error('Error al iniciar la sesion');
            res.redirect('/');
        })
        
    } catch (error) {
        req.flash("mensajes",[{msg:error.message}]);
        return res.redirect('/auth/login');
    }
}

const closeSec = (req,res,next)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
    return res.redirect('/auth/login');
    });
}

module.exports = {
    loginForm,
    registerForm,
    registerUser,
    confirmarCuenta,
    loginAccess,
    closeSec,
}