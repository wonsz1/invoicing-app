var Joi = require('joi');

module.exports = {
    body: {
      name: Joi.string().required(),
      user_id: Joi.number().required(),
      type: Joi.number().required(),
      sell_date: Joi.date().required(),
      issue_date: Joi.date().required(),
      sum_net: Joi.number().required(),
      sum_vat: Joi.number().required(),
      sum_gross: Joi.number().required(),
      txn_name: Joi.array().required(),
      txn_price_net: Joi.array().required(),
      txn_value_net: Joi.array().required(),
      txn_vat: Joi.array().required(),
      txn_value_gross: Joi.array().required(),
      txn_quantity: Joi.array().required()
    }
};