var Joi = require('joi');

module.exports = {
    body: {
        name: Joi.string().required(),
        sell_date: Joi.date().required(),
        issue_date: Joi.date().required(),
        sum_net: Joi.number().required(),
        sum_vat: Joi.number().required(),
        sum_gross: Joi.number().required()
    }
}