const bcrypt = require('bcryptjs');
const mongoosePaginate = require('mongoose-paginate');
const User = require('../models/user');
const jwt = require('../jwt/jwt');

function prueba(request, response) {
	response.status(200).send({
		message: 'Prueba de servicio'
	});
}

function createUser(request, response) {
	let userParams = request.body;
	console.log(userParams);

	let user = new User();
	if (userParams.name && userParams.email && userParams.password && userParams.role && userParams.telefono && userParams.cedula) {
		user.name = userParams.name;
		user.email = userParams.email;
		user.role = userParams.role;
		user.telefono = userParams.telefono;
		user.cedula = userParams.cedula;
		user.edad = userParams.edad;
		user.estadoCivil = userParams.estadoCivil;

		User.find({
			$or: [
				{ cedula: user.cedula }
			]
		}).exec((err, users) => {
			if (err) return response.status(500).send({ message: 'Error en la petición de usuarios' });
			if (users && users.length >= 1) {
				return response.status(200).send({ message: `El usuario con cedula: ${user.cedula} que intenta registrar ya existe` });
			} else {
				let salt = bcrypt.genSaltSync(10, userParams.password);
				let hash = bcrypt.hashSync(userParams.password, salt);
				user.password = hash;
				user.save((err, userStored) => {
					if (err) {
						return response.status(500).send({
							status: 500,
							message: 'Error en el servidor',
							sucess: false
						})
					}
					if (userStored) {
						user.password = undefined;
						return response.status(200).send({
							status: 200,
							user: userStored,
						})
					} else {
						return response.status(404).send({
							status: 404,
							message: `No se ha logrado ingresar el usuario ${user.name}`
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

function updateUser(request, response) {

	let user = new User();
	let userId = request.params.id;
	let params = request.body;
	delete params.password;


	User.find({
		$or: [
			{ cedula: params.cedula }
		]
	}).exec((err, users) => {
		let user_isset = false;
		users.forEach((user) => {
			if (user && user._id != userId) {
				user_isset = true;
			}
		});

		if (user_isset) {
			return response.status(404).send({
				message: 'Los datos que quieres actualizar ya se encuentran en uso',
				status: 404
			});
		}

		User.findByIdAndUpdate(userId, params, { new: true }, (err, userUpdated) => {
			if (err) {
				return response.status(500).send({
					status: 500,
					message: 'Ocurrio un error en el servidor',
					er: err
				});
			}
			if (!userUpdated) {
				return response.status(404).send({
					status: 404,
					message: 'No se ha podido actualizar los datos del usuario'
				});
			} else {
				userUpdated.password = undefined;
				return response.status(200).send({
					status: 200,
					user: userUpdated
				});
			}
		});
	});


}

function getUsers(request, response) {
	let page = 1;
	let itemsPerPage = 5;
	console.log(request.params.page);
	if (request.params.page) {
		page = request.params.page;
	}

	if (request.params.page === '0') {
		page = 1;
		console.log(true);
	}

	User.paginate({}, { page: page, limit: itemsPerPage, select: '-password', sort: '_id' }, (err, users) => {
		if (err) return response.status(500).send({
			status: 500,
			message: 'Error en el servidor'
		});

		if (users.docs.length === 0) return response.status(404).send({
			status: 404,
			message: 'No se han encontrado usuarios en la búsqueda'
		});

		let data = {
			users: users.docs,
			totalUsersStored: users.total,
			currentPage: users.page,
			totalPages: users.pages
		}
		response.status(200).send({
			status: 200,
			data: data
		});
	});
}

function deleteUser(request, response) {
	let userId = request.params.id;

	User.find({
		$or: [
			{ _id: userId }
		]
	}).exec((err, user) => {
		if (!user || user.length === 0) {
			return response.status(404).send({
				status: 404,
				message: `El usuario con id: ${userId}, no existe en la base de datos`
			});
		} else {
			User.findOneAndDelete({ _id: userId }, (err, userDeleted) => {
				if (err) return response.status(500).send({
					status: 500,
					message: 'Error en el servidor'
				});

				return response.status(200).send({
					status: 200,
					message: `El usuairo con el id: ${userId} ha sido eliminado`,
					userDeleted: userDeleted
				});
			});
		}
	});
}

function loginUser(request, response) {
	let params = request.body;

	User.findOne({ cedula: params.cedula }, (err, user) => {
		if (err) return response.status(500).send({
			status: 500,
			message: 'error en el servidor'
		});

		if (!user) return response.status(404).send({
			status: 404,
			message: 'Usuario incorrecto'
		})

		if (!bcrypt.compareSync(params.password, user.password)) {
			return response.status(404).send({
				status: 404,
				message: 'Password incorrecto'
			});
		}

		user.password = undefined;
		return response.status(200).send({
			status: 200,
			user: user,
			token: jwt.createToken(user)
		})
	});
}

module.exports = {
	prueba,
	createUser,
	updateUser,
	getUsers,
	deleteUser,
	loginUser
}