const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const bankingControllers = require('./banking-controller');
const bankingValidator = require('./banking-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/banking', route);

  // Create Account
  // route.post(
  //   '/create-account',
  //   authenticationMiddleware,
  //   celebrate(bankingValidator.createAccount),
  //   bankingControllers.createAccount
  // );

  // Get balance
  route.get(
    '/check/balance/:account_number',
    authenticationMiddleware,
    bankingControllers.getBalance
  );

  // Add balance
  route.patch(
    '/put-in',
    authenticationMiddleware,
    celebrate(bankingValidator.updateBalance),
    bankingControllers.putIn
  );

  // Add balance
  route.patch(
    '/cash-out',
    authenticationMiddleware,
    celebrate(bankingValidator.updateBalance),
    bankingControllers.cashOut
  );

  // Transfer
  route.patch(
    '/transfer-to',
    authenticationMiddleware,
    celebrate(bankingValidator.transferTo),
    bankingControllers.transferTo
  );

  // Check Mutation
  route.get(
    '/check/mutation/:account_number',
    authenticationMiddleware,
    bankingControllers.getMutation
  );

  // Change Pin
  route.patch(
    '/change-pin',
    authenticationMiddleware,
    celebrate(bankingValidator.changePin),
    bankingControllers.changePin
  );
  // Delete Mutation
  // route.get(
  //   '/check/mutation/:account_number',
  //   authenticationMiddleware,
  //   bankingControllers.deleteMutation
  // );

  // // // Create Passcode
  // // route.post(
  // //   '/passcode',
  // //   authenticationMiddleware,
  // //   celebrate(bankingValidator.createPasscode),
  // //   bankingControllers.createPasscode
  // // );

  // // Check Mutation
  // route.get(
  //   '/mutation',
  //   authenticationMiddleware,
  //   bankingControllers.getMutation
  // );

  // // Change Passcode
  // route.post(
  //   '/passcode',
  //   authenticationMiddleware,
  //   celebrate(bankingValidator.changePasscode),
  //   bankingControllers.changePasscode
  // );

  // // Delete account
  // route.delete(
  //   '/:id',
  //   authenticationMiddleware,
  //   bankingControllers.deleteAccount
  // );
};
