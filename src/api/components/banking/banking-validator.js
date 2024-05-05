const joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');

module.exports = {
  // createAccount: {
  //   body: {
  //     full_name: joi.string().min(1).max(100).required().label('Name'),
  //     pin : joi.number().min(6).max(6).required(),
  //   },
  // },

  changePin: {
    body: {
      account_number: joi
        .number()
        .min(150000000000)
        .max(150999999999)
        .required()
        .label('Account number'),
      pin: joi
        .number()
        .integer()
        .min(100000)
        .max(999999)
        .required()
        .label('Pin'),
      new_pin: joi
        .number()
        .integer()
        .min(100000)
        .max(999999)
        .required()
        .label('New Pin'),
      new_pin_confirm: joi.number().required().label('New Pin Confirm'),
    },
  },

  updateBalance: {
    body: {
      account_number: joi
        .number()
        .min(150000000000)
        .max(150999999999)
        .required()
        .label('Account number'),
      amount: joi.number().required().label('Amount'),
      pin: joi.number().min(100000).max(999999).required().label('Pin'),
    },
  },

  transferTo: {
    body: {
      account_number: joi
        .number()
        .min(150000000000)
        .max(150999999999)
        .required()
        .label('Account number'),
      recipient_account: joi
        .number()
        .min(150000000000)
        .max(150999999999)
        .required()
        .label('Account number'),
      amount: joi.number().required().label('Amount'),
      pin: joi.number().min(100000).max(999999).required().label('Pin'),
    },
  },
};
