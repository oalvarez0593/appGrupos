const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const GruposSchema = Schema({
	name: String,
	profesor: String,
	idGrupo: String,
	zona: String
});
GruposSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Grupos', GruposSchema);