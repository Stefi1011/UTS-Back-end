const bcrypt = require('bcrypt');

/**
 * Hash a plain text password
 * @param {string} password - The password to be hashed
 * @returns {string}
 */
async function hashPassword(password) {
  const saltRounds = 16;
  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });

  return hashedPassword;
}

/**
 * Hash a plain text password or number
 * @param {string|number} pin - The data to be hashed
 * @returns {string}
 */
async function hashPin(pin) {
  // Convert number to string if it's a number
  const stringPin = typeof pin === 'number' ? pin.toString() : pin;

  const saltRounds = 16;
  const hashedPin = await new Promise((resolve, reject) => {
    bcrypt.hash(stringPin, saltRounds, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });

  return hashedPin;
}
/**
 * Compares a plain text password and its hashed to determine its equality
 * Mainly use for comparing login credentials
 * @param {string} password - A plain text password
 * @param {string} hashedPassword - A hashed password
 * @returns {boolean}
 */
async function passwordMatched(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

async function pinMatched(pin, hashedPin) {
  // Convert number to string if it's a number
  const parsedPin = typeof pin === 'number' ? pin.toString() : pin;
  return bcrypt.compareSync(parsedPin, hashedPin);
}
module.exports = {
  hashPassword,
  hashPin,
  passwordMatched,
  pinMatched
};
