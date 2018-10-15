var Joi = require('joi');

module.exports = {
    body: {
        nip: Joi.number().required(),
        company_name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
    }
}