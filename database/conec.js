const mongoose = require('mongoose');

require('dotenv').config()

//conexion al base de datos
const clientDb = mongoose
  .connect(process.env.URI)
  .then((m)=> {
    console.log("conexion exitosa")
    return m.connection.getClient()
  })
  .catch(e=> console.log(e));

  module.exports = clientDb