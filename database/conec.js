const mongoose = require('mongoose');


//conexion al base de datos
mongoose
  .connect(process.env.URI)
  .then(()=> console.log("conexion exitosa"))
  .catch(e=> console.log(e));
