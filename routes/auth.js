const express = require('express');
const {body} = require('express-validator');
const { loginForm, registerForm, registerUser,confirmarCuenta,loginAccess, closeSec } = require('../controllers/authcontrollers');
const router = express.Router();


router.get("/register",registerForm);
router.get("/login", loginForm);
router.post("/login",[
    body("email","Ingrese un correo valido")
    .trim()
    .isEmail()
    .normalizeEmail(),
    body("pass","Contraseña minimo 6 caracteres")
    .trim()
    .isLength({min:6})
    .escape()
] ,loginAccess);
router.post("/register",
[
    body("userName","nombre invalido")
    .trim()
    .notEmpty()
    .escape(),
    body("email","Ingrese un correo valido")
    .trim()
    .isEmail()
    .normalizeEmail(),
    body("userpassword","Contraseña minimo 6 caracteres")
    .trim()
    .isLength({min:6})
    .escape()
    .custom((value,{req})=>{
        if(value !== req.body.repetirPassword){
            throw new Error('las contraseñas no coinciden');
        }else{
        return value;
    }
    }),
],registerUser);
router.get("/confirmar/:token",confirmarCuenta);
router.get('/logout',closeSec);
module.exports = router;