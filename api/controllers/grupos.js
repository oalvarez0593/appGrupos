const mongoosePaginate = require('mongoose-paginate');
const Grupo = require('../models/grupos');
const jwt = require('../jwt/jwt');

function prueba(request, response) {
	response.status(200).send({
		message: 'Prueba de servicio de grupos'
	});
}

function createGrupos(request, response) {
	let grupoParams = request.body;

	let grupo = new Grupo();
	if (grupoParams.name && grupoParams.profesor && grupoParams.idGrupo && grupoParams.zona) {
		grupo.name = grupoParams.name;
		grupo.profesor = grupoParams.profesor;
		grupo.idGrupo = grupoParams.idGrupo;
		grupo.zona = grupoParams.zona;

		Grupo.find({
			$or: [
				{ name: grupo.name }
			]
		}).exec((err, grupos) => {
			if (err) return response.status(500).send({ message: 'Error en la petición de usuarios' });
			if (grupos && grupos.length >= 1) {
				return response.status(200).send({ message: `El grupo con nombre: ${grupo.name} que intenta registrar ya existe` });
			} else {
				grupo.save((err, grupoStored) => {
					if (err) {
						return response.status(500).send({
							status: 500,
							message: 'Error en el servidor',
							sucess: false
						})
					}
					if (grupoStored) {
						return response.status(200).send({
							status: 200,
							grupo: grupoStored,
						})
					} else {
						return response.status(404).send({
							status: 404,
							message: `No se ha logrado ingresar el grupo ${grupo.name}`
						})
					}
				});
			}
		})

	} else {
		response.status(200).send({
			message: 'Rellena todos los campos necesarios'
		});
	}
}



module.exports = {
    prueba,
    createGrupos
}