const express = require('express');
const limiter = require('express-rate-limit')
const authenticationControllers = require('./authentication-controller');
const authenticationValidators = require('./authentication-validator');
const celebrate = require('../../../core/celebrate-wrappers');

const route = express.Router();

module.exports = (app) => {
  app.use('/authentication', route);

  route.post(
    '/login',
    celebrate(authenticationValidators.login),
    authenticationControllers.login
  );

  // const limitLogin = limiter({
  //   limit: 5,
  //   windowMs: 30 * 1000, // 30 detik
  //   keyGenerator: (request) => request.body.email,
  //   handler: (request, response) => {
  //     const date = new Date();
  //     const resetAttemptTime = new Date (date.getTime() + windowMs);
  //     response.status(403).json({
  //       message: ``
  //     })

  //   }
  // })
};
