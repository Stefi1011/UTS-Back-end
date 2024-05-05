const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

// LIMIT_TIME 30 menit
const LIMIT_TIME = 30 * 60 * 1000; // ini 30 dtk doang

// MAX_FAILED_ATTEMPTS 5 kali
const MAX_FAILED_ATTEMPTS = 5;

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    // dapetin data failedLoginAttempt
    let failedLoginAttempt =
      await authenticationServices.getFailedLoginAttempt(email);

    // kalau gada failedLoginAttempt, maka isi 0
    if (!failedLoginAttempt) {
      failedLoginAttempt = { totalFailedAttempts: 0 };
    }
    // kalau failednya lebih dari sama dengan 5, maka
    if (failedLoginAttempt.totalFailedAttempts >= MAX_FAILED_ATTEMPTS) {
      //cek waktunya
      isTimeEnd = await authenticationServices.checkLimitTime(
        LIMIT_TIME,
        failedLoginAttempt.timestamp
      );

      // kalau waktunya udah kelar, maka reset sehingga user bisa coba login lagi
      if (isTimeEnd) {
        await authenticationServices.resetFailedLoginAttempt(email);
      }

      // kalau waktu belum kelar, minta tunggu sesuai waktunya
      else {
        const nowTime = new Date();
        const timeElapsed = nowTime - failedLoginAttempt.timestamp;
        const timeRemaining = LIMIT_TIME - timeElapsed;
        const minutes = Math.floor(timeRemaining / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        const timeRemainingFormatted = `${minutes} minutes ${seconds} seconds`;
        return response.status(403).json({
          success: false,
          message: `Too many failed login attempts. Please try again after ${timeRemainingFormatted}.`,
        });
      }
    } else {
      // Check login credentials
      const loginSuccess = await authenticationServices.checkLoginCredentials(
        email,
        password
      );

      // kalau loginnya berhasil, maka langsung reset dan tampilin hasilnya
      if (loginSuccess) {
        await authenticationServices.resetFailedLoginAttempt(email);
        return response.status(200).json(loginSuccess);
      } else {
        // kalau loginnya gagal, tambahin failedLoginAttemptnya, throw error, dan kasih tau ini udah attempt ke berapa
        await authenticationServices.incrementFailedLoginAttempt(email);
        failedLoginAttempt =
          await authenticationServices.getFailedLoginAttempt(email);
        throw errorResponder(
          errorTypes.INVALID_CREDENTIALS,
          `Wrong email or password. Attempt = ${failedLoginAttempt.totalFailedAttempts}`
        );
      }
    }
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
