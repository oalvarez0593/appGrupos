const mongoosePaginate = require('mongoose-paginate');
const User = require('../models/grupos');
const jwt = require('../jwt/jwt');

function prueba(request, response) {
	response.status(200).send({
		message: 'Prueba de servicio de grupos'
	});
}



module.exports = {
	prueba
}