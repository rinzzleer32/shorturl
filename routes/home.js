const express = require("express");
const { leerUrl, agregarURL, eliminarUrl, editarURL, editarURLForm,redireccionamiento } = require("../controllers/homeControllers");
const { formPerfil, actualizar} = require("../controllers/profileController");
const userVerfication = require("../middlewares/userVerfication");
const router = express.Router();
const urlValidar =  require("../middlewares/validUrl");

router.get("/",userVerfication,leerUrl);
router.post("/",userVerfication,urlValidar, agregarURL);
router.get("/eliminar/:id",userVerfication,eliminarUrl);
router.get("/editar/:id",userVerfication,editarURLForm);
router.post("/editar/:id",userVerfication,urlValidar,editarURL);


router.get("/perfil",userVerfication,formPerfil);
router.post("/perfil",userVerfication,actualizar);
router.get("/:shortURL",redireccionamiento);


module.exports = router;