const bankingRepository = require('./banking-repository');
const { pinMatched, hashPin } = require('../../../utils/password');

/**
 * Create account
 * @param {number} accountNumber - account's number
 * @param {number} full_name - name of the account's holder
 * @param {number} pin - pin of the account
 * @returns {boolean}
 */
async function createAccount(accountNumber, full_name, pin, email) {
  try {
    await bankingRepository.createAccount(accountNumber, full_name, pin, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Get balance
 * @param {number} accountNumber - account's number
 * @returns {number}
 */
async function getBalance(accountNumber) {
  const account = await bankingRepository.getAccount(accountNumber);
  return account.balance;
}

/**
 * Generates a new unique account number.
 * Account numbers are composed of a prefix followed by randomly generated digits.
 * @returns {number} A new unique account number
 */
async function generateAccountNumber() {
  try {
    const prefix = '150';
    const randomDigits = Math.floor(Math.random() * 1000000000)
      .toString()
      .padStart(7, '0');
    const accountNumber = parseInt(prefix + randomDigits);

    return accountNumber;
  } catch (error) {
    // Handle any potential errors here
    console.error('An error occurred while generating account number:', error);
    return null; // Return null in case of error
  }
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const account = await bankingRepository.getAccountByEmail(email);

  if (account) {
    return true;
  }

  return false;
}

/**
 * Add balance
 * @param {number} accountNumber - account's number
 * @param {number} balance- current's balance
 * @param {number} addAmountBalance - amount of balance to add
 * @returns {boolean}
 */
async function addBalance(accountNumber, balance, addAmountBalance) {
  const totalBalance = balance + addAmountBalance;
  return await bankingRepository.updateBalance(accountNumber, totalBalance);
}

/**
 * Substract balance
 * @param {number} accountNumber - account's number
 * @param {number} balance- current's balance
 * @param {number} addAmountBalance - amount of balance to add
 * @returns {boolean}
 */
async function substractBalance(accountNumber, balance, addAmountBalance) {
  const totalBalance = balance - addAmountBalance;
  if (totalBalance < 0) {
    throw new Error('Insufficient balance');
  }
  return await bankingRepository.updateBalance(accountNumber, totalBalance);
}

/**
 * Check pin
 * @param {number} accountNumber - account's number
 * @param {number} pin - account's pin
 * @returns {boolean}
 */
async function checkPin(accountNumber, pin) {
  const account = await bankingRepository.getAccount(accountNumber);
  if (!account) {
    throw new Error(`Account with account number ${accountNumber} not found`);
  }

  return pinMatched(pin, account.pin);
}

/**
 * Create mutation
 * @param {String} transaction - type of transaction
 * @param {number} accountNumber - account's number
 * @param {number} amount - amount to transfer
 * @param {number} recipientAccount - recipient's account
 * @param {number} senderAccount - sender's account
 * @returns {boolean}
 */
async function createMutation(
  transaction,
  accountNumber,
  amount,
  recipientAccount,
  senderAccount
) {
  try {
    let mutationData = {
      type: null,
      amount: null,
      recipient_account: null,
    };
    if (transaction === 'Transfer to') {
      mutationData = {
        type: transaction,
        amount: amount,
        recipient_account: recipientAccount,
      };
    } else if (transaction === 'Transfer for') {
      mutationData = {
        type: transaction,
        amount: amount,
        sender_account: senderAccount,
      };
    } else {
      mutationData = {
        type: transaction,
        amount: amount,
      };
    }

    await bankingRepository.createMutation(accountNumber, mutationData);
  } catch (err) {
    return null;
  }
  return true;
}

/**
 * Get mutation
 * @param {number} accountNumber - account's number
 * @returns {Array}
 */
async function getMutationByAccountNumber(accountNumber) {
  const account = await bankingRepository.getAccount(accountNumber);

  if (!account) {
    throw new Error(`Account with account number ${accountNumber} not found`);
  }
  return await bankingRepository.getMutationByAccount(account);
}

/**
 * Change Pin
 * @param {number} accountNumber - account's number
 * @param {number} newPin - account's new pin
 * @returns {boolean}
 */
async function changePin(accountNumber, newPin) {
  const account = await bankingRepository.getAccount(accountNumber);

  if (!account) {
    throw new Error(`Account with account number ${accountNumber} not found`);
  }
  
  const hashedPin = await hashPin(newPin);
  return await bankingRepository.changePin(accountNumber, hashedPin);
}

/**
 * Delete mutation
 * @param {number} accountNumber - account's number
 * @returns {boolean}
 */
async function deleteMutation(accountNumber) {
  const account = await bankingRepository.getAccount(accountNumber);

  if (!account) {
    throw new Error(`Account with account number ${accountNumber} not found`);
  }
  return await bankingRepository.deleteMutation(accountNumber);
}

/**
 * Delete Account
 * @param {number} accountNumber - account's number
 * @returns {boolean}
 */
async function deleteAccount(accountNumber) {
  const account = await bankingRepository.getAccount(accountNumber);

  if (!account) {
    throw new Error(`Account with account number ${accountNumber} not found`);
  }
  return await bankingRepository.deleteAccount(accountNumber);
}

module.exports = {
  createAccount,
  getBalance,
  generateAccountNumber,
  emailIsRegistered,
  addBalance,
  substractBalance,
  checkPin,
  createMutation,
  getMutationByAccountNumber,
  changePin,
  deleteMutation,
  deleteAccount,
};
