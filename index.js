
//importaciones
const { create } = require("express-handlebars");
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const MongoSanitize = require('express-mongo-sanitize');
const User = require("./models/User");
const csrf = require('csurf');
const MongoStore = require('connect-mongo');
require('dotenv').config();
const clientDb = require('./database/conec')
const cors = require("cors")
const app = express();
const formidable = require('formidable');
const corsOption ={
    credentials : true,
   origin: process.env.PathHeroku || "*",
   methods: ['GET','POST']
};
app.use(cors());
app.use(session({
    secret: process.env.Secretsesion,
    resave: false,
    saveUninitialized: true,
    name: "Skidush",
    store: MongoStore.create({
        clientPromise: clientDb,
        dbName: process.env.dbname,
    }), 
    cookie: {secure: process.env.mode === 'production', maxAge:30*24*60*60*1000},
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
app.use(MongoSanitize());
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
