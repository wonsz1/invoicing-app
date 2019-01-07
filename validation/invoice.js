const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');
const Joi = BaseJoi.extend(Extension);

module.exports = {
    body: {
      buyer_id: Joi.number().required(),
      seller_id: Joi.number().required(),
      invoice: {
        name: Joi.string().required(),
        type: Joi.number().required(),
        sell_date: Joi.date().format('YYYY-MM-DD').required(),
        issue_date: Joi.date().format('YYYY-MM-DD').required(),
        sum_net: Joi.number().required(),
        sum_vat: Joi.number().required(),
        sum_gross: Joi.number().required(),
      },
      transactions: Joi.array().min(1)
    }
};