var Joi = require('joi');

module.exports = {
    body: {
        nip: Joi.number().required(),
        company_name: Joi.string().required(),
        email: Joi.string().email().optional(),
        nip: Joi.number().required(),
        account_number: Joi.number().optional(),
        street: Joi.string().required(),
        postal_code: Joi.string().optional(),
        city: Joi.string().required(),
    }
}