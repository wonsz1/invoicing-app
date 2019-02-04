var Joi = require('joi');

module.exports = {
    body: {
        uuid: Joi.string().required(),
        nip: Joi.number().required(),
        company_name: Joi.string().required(),
        email: Joi.string().email().allow(''),
        account_number: Joi.string().allow(''),
        address: Joi.string().required(),
    }
}