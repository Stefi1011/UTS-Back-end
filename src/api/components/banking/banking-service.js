const bankingRepository = require('./banking-repository');
const { pinMatched, hashPin } = require('../../../utils/password');

async function createAccount(accountNumber, full_name, pin) {
  try {
    await bankingRepository.createAccount(accountNumber, full_name, pin);
  } catch (err) {
    return null;
  }

  return true;
}

async function getBalance(accountNumber) {
  const account = await bankingRepository.getAccount(accountNumber);
  return account.balance;
}

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

async function addBalance(accountNumber, balance, addAmountBalance) {
  const totalBalance = balance + addAmountBalance;
  return await bankingRepository.updateBalance(accountNumber, totalBalance);
}

async function substractBalance(accountNumber, balance, addAmountBalance) {
  const totalBalance = balance - addAmountBalance;
  if (totalBalance < 0) {
    throw new Error('Insufficient funds');
  }
  return await bankingRepository.updateBalance(accountNumber, totalBalance);
}

async function checkPin(accountNumber, pin) {
  const account = await bankingRepository.getAccount(accountNumber);
  return pinMatched(pin, account.pin);
}

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

async function getMutationByAccountNumber(accountNumber) {
  const account = await bankingRepository.getAccount(accountNumber);

  if (!account) {
    throw new Error(`Account with account number ${accountNumber} not found`);
  }
  return await bankingRepository.getMutationByAccount(account);
}

async function changePin(accountNumber, newPin) {
  const account = await bankingRepository.getAccount(accountNumber);
  
  if (!account) {
    throw new Error(`Account with account number ${accountNumber} not found`);
  }
  const hashedPin = await hashPin(newPin);
  return await bankingRepository.changePin(accountNumber, hashedPin);
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
};
