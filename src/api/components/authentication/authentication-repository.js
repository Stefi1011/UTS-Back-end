const { User, FailedLoginAttempt } = require('../../../models');

/**
 * Get user by email for login information
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Get failedLoginAttempt by email for failed login information
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getFailedLoginAttempt(email) {
  return FailedLoginAttempt.findOne({ email });
}

/**
 * Reset (delete) failedLoginAttempt by email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function resetFailedLoginAttempt(email) {
  return FailedLoginAttempt.deleteOne({ email });
}

/**
 * Create new failedLoginAttempt by failedAttempts information from service
 * @param {string} email - Email
 * @returns {Promise}
 */
async function createFailedLoginAttempt(failedAttempt) {
  const newFailedAttempt = new FailedLoginAttempt(failedAttempt);
  return newFailedAttempt.save();
}

/**
 * Update failedLoginAttempt by failedAttempts information from service
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateFailedLoginAttempt(failedAttempt){
  failedAttempt.totalFailedAttempts+= 1;
  failedAttempt.timestamp = new Date();
  return failedAttempt.save();
}

module.exports = {
  getUserByEmail,
  getFailedLoginAttempt,
  resetFailedLoginAttempt,
  createFailedLoginAttempt,
  updateFailedLoginAttempt,
};
