const { Account } = require('../../../models');

/**
 * Get account
 * @param {string} accountNumber - Email
 * @returns {Promise}
 */
async function getAccount(accountNumber) {
  const account = Account.findOne({ account_number: accountNumber });
  return account;
}

async function createAccount(account_number, full_name, pin) {
  return Account.create({
    account_number,
    full_name,
    pin,
  });
}

// async function createFailedLoginAttempt(failedAttempt) {
//   const newFailedAttempt = new FailedLoginAttempt(failedAttempt);
//   return newFailedAttempt.save();
// }

async function getAccountByEmail(email) {
  return Account.findOne({ email });
}

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

async function createMutation(accountNumber, mutationData) {
  console.log(mutationData);
  return Account.updateOne(
    { account_number: accountNumber },
    {
      $push: { mutation: mutationData },
    }
  );
}
async function deleteMutation(accountNumber, mutationData) {
  return Account.updateOne(
    { account_number: accountNumber },
    {
      $pull: { mutation: mutationData },
    }
  );
}

async function getMutationByAccount(account) {
  return account.mutation;
}

async function changePin(accountNumber, newPin) {
  return Account.updateOne(
    { account_number: accountNumber },
    {
      $pull: { pin: newPin },
    }
  );
}

module.exports = {
  getAccount,
  createAccount,
  getAccountByEmail,
  updateBalance,
  createMutation,
  getMutationByAccount,
  changePin
};
