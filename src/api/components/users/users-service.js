const usersRepository = require('./users-repository');
const bankingRepository = require('../banking/banking-repository');
const bankingService = require('../banking/banking-service');
const {
  hashPassword,
  hashPin,
  passwordMatched,
} = require('../../../utils/password');
const { account_number } = require('../../../models/accounts-schema');

/**
 * Get list of users (+pagination)
 * @param {number} pageNumber - Page number
 * @param {number} pageSize -  Page size
 * @param {string} search - Search
 * @param {string} sort - Sortiing (asc and desc)
 * @returns {Array}
 */
async function getUsers(pageNumber, pageSize, search, sort) {
  // hitung skip untuk melewatkan data dan batas untuk pagination
  const skip = (pageNumber - 1) * pageSize;
  const batas = pageSize;

  let searchField = null;
  let searchKey = '';

  // memisahkan searchField dan searchKey jika search diisi sesuai ketentuan
  if (search && search.includes(':')) {
    [searchField, searchKey] = search.split(':');
  }

  let searchQuery = {};

  // mencari data berdasarkan search
  if (searchField === 'name' || searchField === 'email') {
    searchQuery[searchField] = { $regex: searchKey, $options: 'i' };
  }

  let sortField = null;
  let sortKey = '';

  // membuat default bagi sort apabila user tidak request sort
  if (!sort) {
    sort = 'email: asc';
  }

  // memisahkan sortField dan sortKey
  if (sort && sort.includes(':')) {
    [sortField, sortKey] = sort.split(':');
  }

  let sortOptions = {};

  // membuat default jika user salah format
  if (!(sortField === 'name' || sortField === 'email')) {
    sortField = 'email';
    sortKey = 'asc';
  }

  sortOptions[sortField] = sortKey === 'desc' ? -1 : 1;
  if (sortField === 'name' || sortField === 'email') {
    sortOptions[sortField] = sortKey === 'desc' ? -1 : 1;
  } else {
    (sortOptions[sortField] = sortField === 'email'),
      sortKey === 'desc' ? -1 : 1;
  }

  // cari users
  const users = await usersRepository.getUsers(
    skip,
    batas,
    searchQuery,
    sortOptions
  );

  // cari jumlah users
  //const count = await usersRepository.countUsers(search);

  const results = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    results.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  return results;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password, pin, account_number) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  // hash pin
  const hashedPin = await hashPin(pin);

 
  try {
    await usersRepository.createUser(name, email, hashedPassword);
    await bankingRepository.createAccount(account_number, name, hashedPin);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

/**
 * Count total user
 * @param {string} search - Key to search
 * @returns {boolean}
 */
async function countUsers(search) {
  let searchField = null;
  let searchKey = '';

  // memisahkan searchField dan searchKey jika search diisi sesuai ketentuan
  if (search && search.includes(':')) {
    [searchField, searchKey] = search.split(':');
  }

  let searchQuery = {};

  // mencari data berdasarkan search
  if (searchField === 'name' || searchField === 'email') {
    searchQuery[searchField] = { $regex: searchKey, $options: 'i' };
  }

  const count = await usersRepository.countUsers(searchQuery);
  return count;
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
  countUsers,
};
