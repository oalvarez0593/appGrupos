const jwt = require('jwt-simple');
const moment = require('moment');

const secret_word = 'backend_para_app_de_grupo_123';

function createToken(user) {
    let payload = {
        name: user.name,
        email: user.email,
        role: user.role,
        telefono: user.telefono,
        cedula: user.cedula,
        edad: user.edad,
        estadoCivil: user.estadoCivil,
        iat: moment().unix(),
        exp: moment().add(5, 'minutes').unix()
    }

    return jwt.encode(payload, secret_word);
}

module.exports = {
    createToken
}