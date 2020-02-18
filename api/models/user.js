const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const UserSchema = Schema({
	name: String,
	email: String,
	password: String,
	role: String,
	telefono: String,
	cedula: String,
	edad: Number,
	estadoCivil: String
});
UserSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('User', UserSchema);