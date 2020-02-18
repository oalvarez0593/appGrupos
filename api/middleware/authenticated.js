const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'backend_para_app_de_grupo_123';

function getToken(request, response, next) {
    if (!request.headers.authorization) {
        return response.status(403).send({ message: 'La petición no tiene la cabecera de autenticación' });
    }

    const token = request.headers.authorization.replace(/['"]+/g, '');

    try {
        var payload = jwt.decode(token, secret);

        if (payload.exp <= moment().unix()) {
            return response.status(401).send({ message: 'El token ha expirado' });
        }
    } catch (e) {

        return response.status(404).send({ message: 'El token no es valido' });
    }
    request.user = payload;
    next();
}
module.exports = {
    getToken
}