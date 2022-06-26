
//importaciones
const { create } = require("express-handlebars");
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const User = require("./models/User");
const csrf = require('csurf');
require('dotenv').config();
require('./database/conec');
const app = express();
const formidable = require('formidable');

app.use(session({
    secret:'beat it',
    resave: false,
    saveUninitialized: true,
    name: "Skidush",
}))

app.use(flash());
// gestion de sesiones con pasport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user,done)=>done(null,{id: user._id,userName: user.userName}));//req.user
passport.deserializeUser(async(user,done)=>{
    const userDB= await User.findById(user.id);
    return done(null,{id: userDB._id,userName: userDB.userName})
})

const hbs = create({
    extname: ".hbs",
    partialsDir: ["views/components"],
});

app.engine(".hbs", hbs.engine);
app.set('view engine', 'hbs');
app.set("views", "./views");




//middleware
app.use(express.urlencoded({extended: true}));
app.use(express.text({extended: true}));


app.use(csrf());
app.use((req,res,next)=>{
    res.locals.csrfToken = req.csrfToken();
    res.locals.mensajes = req.flash("mensajes");
    next();
});
app.use("/",require('./routes/home'));
app.use("/auth",require('./routes/auth'));
app.use(express.static(__dirname + "/public"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log("Servidor encendido " + PORT));
