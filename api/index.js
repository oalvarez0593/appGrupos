var mongoose = require('mongoose');
var app = require('./app');

const portListen = process.env.PORT = process.env.PORT || 3000;
const ambiente = process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/grupos';
} else {
    urlDB = process.env.MONGO_URI;
}

/* *****************************  	CONEXIÓN A LA BASE DATOS 	******************************** */

mongoose.Promise = global.Promise;
mongoose.connect(urlDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("La conexión a la base de datos grupos se ha realizado correctamente");
    app.listen(portListen, () => {
        console.log(`Servidor corriendo en el puerto ${portListen}`);
    });
})
    .catch(err => console.log(err));