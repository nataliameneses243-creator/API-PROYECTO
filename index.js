const express = require('express');
const app = express();

const mongoose = require('mongoose'); 
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const postRoute=require('./routes/post');
app.use('/servicios', postRoute);


mongoose.connect(process.env.MONGO_URI);

const connection = mongoose.connection //creo una conexion a la base de datos.
connection.once('open', () => {

  console.log('Mongodb conectado');
});



app.listen(10000); //Puerto por donde escucha el servidor.
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});