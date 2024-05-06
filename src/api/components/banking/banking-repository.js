const { Account } = require('../../../models');
const { account_number } = require('../../../models/accounts-schema');

/**
 * Get account
 * @param {number} accountNumber - account's number
 * @returns {Promise}
 */
async function getAccount(accountNumber) {
  const account = Account.findOne({ account_number: accountNumber });
  return account;
}


/**
 * Create account
 * @param {number} account_number - account's number
 * @param {string}  full_name- account's owner name
 * @param {number}  pin- account's pin
 * @returns {Promise} 
 */
async function createAccount(account_number, full_name, pin, email) {
  return Account.create({
    account_number,
    full_name,
    pin,
    email,
  });
}

/**
 * Get account by email
 * @param {string} email - email when account is created
 * @returns {Promise} 
 */
async function getAccountByEmail(email) {
  return Account.findOne({ email });
}

/**
 * Update balance
 * @param {number} accountNumber - account's number
 * @param {number} totalBalance - balance to replace current balance
 * @returns {Promise} 
 */
async function updateBalance(accountNumber, totalBalance) {
  return Account.updateOne(
    {
      account_number: accountNumber,
    },
    {
      $set: {
        balance: totalBalance,
      },
    }
  );
}

/**
 * Create mutation
 * @param {number} accountNumber - account's number
 * @param {Object} mutationData - data such as account number, amount, etc
 * @returns {Promise} 
 */
async function createMutation(accountNumber, mutationData) {
  return Account.updateOne(
    { account_number: accountNumber },
    {
      $push: { mutation: mutationData },
    }
  );
}

/**
 * Delete mutation
 * @param {number} accountNumber - account's number
 * @returns {Promise} 
 */
async function deleteMutation(accountNumber) {
  return Account.updateOne(
    { account_number: accountNumber },
    { $set: { mutation: [] } }
  );
}

/**
 * Get mutation by account
 * @param {Object} account - an account
 * @returns {Promise} 
 */
async function getMutationByAccount(account) {
  return account.mutation;
}

/**
 * Change pin
 * @param {number} accountNumber - account's number
 * @returns {Promise} 
 */
async function changePin(accountNumber, newPin) {
  return Account.updateOne(
    { account_number: accountNumber },
    {
      $set: { pin: newPin },
    }
  );
}

/**
 * delete Account
 * @param {number} accountNumber - account's number
 * @returns {Promise} 
 */
async function deleteAccount(accountNumber) {
  return Account.deleteOne({ account_number: accountNumber });
}
module.exports = {
  getAccount,
  createAccount,
  getAccountByEmail,
  updateBalance,
  createMutation,
  getMutationByAccount,
  changePin,
  deleteMutation,
  deleteAccount,
};
