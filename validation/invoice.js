const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');
const Joi = BaseJoi.extend(Extension);

module.exports = {
    body: {
      name: Joi.string().required(),
      buyer_id: Joi.number().required(),
      seller_id: Joi.number().required(),
      type: Joi.number().required(),
      sell_date: Joi.date().format('YYYY-MM-DD').required(),
      issue_date: Joi.date().format('YYYY-MM-DD').required(),
      sum_net: Joi.number().required(),
      sum_vat: Joi.number().required(),
      sum_gross: Joi.number().required(),
      txn_name: Joi.array().min(1),
      txn_price_net: Joi.array().min(1),
      txn_value_net: Joi.array().min(1),
      txn_vat: Joi.array().min(1),
      txn_value_gross: Joi.array().min(1),
      txn_quantity: Joi.array().min(1)
    }
};