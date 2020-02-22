var express = require('express');
var GruposController = require('../controllers/grupos');
const md_auth = require('../middleware/authenticated');

var api = express.Router();

api.get('/grupos/prueba', GruposController.prueba);
 api.post('/grupos',  md_auth.getToken, GruposController.createGrupos);
/* api.put('/user/:id', md_auth.getToken, UserController.updateUser);
api.get('/users/:page?', md_auth.getToken, UserController.getUsers);
api.get('/users/buscar/:palabra?', md_auth.getToken, UserController.getUsuarioMatch);
api.delete('/user/:id', md_auth.getToken, UserController.deleteUser); */
module.exports = api;