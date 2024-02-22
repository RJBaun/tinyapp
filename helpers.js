// lookup user in database
const getUserByEmail = (users, email) => {
  for (const user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return undefined;
};

const urlsForUser = (db, user) => {
  const userURLs = {};
  for (const id in db) {
    if (db[id].userID === user) {
      userURLs[id] = db[id];
    }
  }
  return userURLs;
};

module.exports = { getUserByEmail, urlsForUser };