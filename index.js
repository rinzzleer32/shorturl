
//importaciones
const { create } = require("express-handlebars");
const express = require('express');

const app = express();

const hbs = create({
    extname: ".hbs",
    partialsDir: ["views/components"],
});

app.engine(".hbs", hbs.engine);
app.set('view engine', 'hbs');
app.set("views", "./views");




//middleware
app.use("/",require('./routes/home'));
app.use("/auth",require('./routes/auth'));
app.use(express.static(__dirname + "/public"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log("Servidor encendido "));
