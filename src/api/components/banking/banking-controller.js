const bankingService = require('./banking-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

// async function createAccount(request, response, next) {
//   try {
//     const {
//       full_name,
//       email,
//       pin
//     } = request.body;
//     const account_number = await bankingService.generateAccountNumber();

//     // Check confirmation password
//     if (password !== password_confirm) {
//       throw errorResponder(
//         errorTypes.INVALID_PASSWORD,
//         'Password confirmation mismatched'
//       );
//     }

//     // Email must be unique
//     const emailIsRegistered = await bankingService.emailIsRegistered(email);
//     if (emailIsRegistered) {
//       throw errorResponder(
//         errorTypes.EMAIL_ALREADY_TAKEN,
//         'Email is already registered'
//       );
//     }

//     const success = await bankingService.createAccount(
//       account_number,
//       full_name,
//       email,
//       phone_number,
//       birth_place,
//       birth_date,
//       address,
//       balance,
//       password
//     );
//     if (!success) {
//       throw errorResponder(
//         errorTypes.UNPROCESSABLE_ENTITY,
//         'Failed to create user'
//       );
//     }

//     return response.status(200).json({ full_name, email });
//   } catch (error) {
//     return next(error);
//   }
// }

/**
 * Handle get balance of account from request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getBalance(request, response, next) {
  const account_number = parseInt(request.params.account_number);
  try {
    const balance = await bankingService.getBalance(account_number);

    if (!balance) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }
    return response.status(200).json({ account_number, balance });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle put in of account from request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function putIn(request, response, next) {
  const account_number = parseInt(request.body.account_number);
  const amount = parseInt(request.body.amount);
  const pin = parseInt(request.body.pin);

  const balance = await bankingService.getBalance(account_number);

  if (!(await bankingService.checkPin(account_number, pin))) {
    throw errorResponder(errorTypes.INVALID_CREDENTIALS, 'Wrong pin');
  }

  try {
    await bankingService.addBalance(account_number, balance, amount);
    const account_number_transaction = 'Put in';

    await bankingService.createMutation(
      account_number_transaction,
      account_number,
      amount
    );
    //console.log("mutation controller");
    const balance_updated = await bankingService.getBalance(account_number);

    return response
      .status(200)
      .json({ account_number, balance, balance_updated });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle cash out of account from request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function cashOut(request, response, next) {
  const account_number = parseInt(request.body.account_number);
  const amount = parseInt(request.body.amount);
  const pin = parseInt(request.body.pin);
  const balance = await bankingService.getBalance(account_number);

  if (!(await bankingService.checkPin(account_number, pin))) {
    throw errorResponder(errorTypes.INVALID_CREDENTIALS, 'Wrong pin');
  }

  try {
    await bankingService.substractBalance(account_number, balance, amount);

    const account_number_transaction = 'Cash out';
    await bankingService.createMutation(
      account_number_transaction,
      account_number,
      amount
    );

    const balance_updated = await bankingService.getBalance(account_number);

    return response
      .status(200)
      .json({ account_number, balance, balance_updated });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle transfer to account for other account from request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function transferTo(request, response, next) {
  const account_number = parseInt(request.body.account_number);
  const recipient_account = parseInt(request.body.recipient_account);
  const amount = parseInt(request.body.amount);
  const pin = parseInt(request.body.pin);
  const balance = await bankingService.getBalance(account_number);

  if (!(await bankingService.checkPin(account_number, pin))) {
    throw errorResponder(errorTypes.INVALID_CREDENTIALS, 'Wrong pin');
  }

  try {
    await bankingService.substractBalance(account_number, balance, amount);
    await bankingService.addBalance(recipient_account, balance, amount);

    account_number_transaction = 'Transfer to';
    recipient_account_transaction = 'Transfer from';

    await bankingService.createMutation(
      account_number_transaction,
      account_number,
      amount,
      recipient_account,
      null
    );
    await bankingService.createMutation(
      recipient_account_transaction,
      recipient_account,
      amount,
      null,
      account_number
    );

    const balance_updated = await bankingService.getBalance(account_number);

    return response
      .status(200)
      .json({ account_number, balance, balance_updated });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get list of mutation from request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getMutation(request, response, next) {
  const account_number = parseInt(request.params.account_number);
  try {
    const all_mutation =
      await bankingService.getMutationByAccountNumber(account_number);
    //console.log(all_mutation);
    return response.status(200).json({ all_mutation });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete mutation of an account from request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteMutation(request, response, next) {
  const account_number = parseInt(request.body.account_number);

  const pin = parseInt(request.body.pin);

  if (!(await bankingService.checkPin(account_number, pin))) {
    throw errorResponder(errorTypes.INVALID_CREDENTIALS, 'Wrong pin');
  }
  try {
    await bankingService.deleteMutation(account_number);
    return response.status(200).json("Mutation has been deleted");
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle change pin of an account from request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function changePin(request, response, next) {
  const account_number = parseInt(request.body.account_number);
  const pin = parseInt(request.body.pin);
  const new_pin = parseInt(request.body.new_pin);
  const new_pin_confirm = parseInt(request.body.new_pin_confirm);

  if (!(await bankingService.checkPin(account_number, pin))) {
    throw errorResponder(errorTypes.INVALID_CREDENTIALS, 'Wrong pin');
  }

  if (new_pin !== new_pin_confirm) {
    throw errorResponder(
      errorTypes.INVALID_PASSWORD,
      'Pin confirmation mismatched'
    );
  }
  try {
    await bankingService.changePin(account_number, new_pin);
    return response.status(200).json('Pin has been changed');
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete account from request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteAccount(request, response, next) {
  const account_number = parseInt(request.body.account_number);
  const pin = parseInt(request.body.pin);
  if (!(await bankingService.checkPin(account_number, pin))) {
    throw errorResponder(errorTypes.INVALID_CREDENTIALS, 'Wrong pin');
  }
  try {
    await bankingService.deleteAccount(account_number);
    return response.status(200).json('Account has been deleted');
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  //createAccount,
  getBalance,
  putIn,
  cashOut,
  transferTo,
  getMutation,
  deleteMutation,
  changePin,
  deleteAccount,
};
