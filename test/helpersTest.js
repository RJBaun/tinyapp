const assert = require('chai').assert;
const { getUserByEmail } = require('../helpers');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', () => {
  it('should return a user with valid email', function() {
    const user = getUserByEmail(testUsers, "user@example.com");
    const expectedUserID = testUsers["userRandomID"];
    assert.equal(user, expectedUserID);
  });
  it('should return undefined if user email does not exist', function() {
    const user = getUserByEmail(testUsers, "userfdgsdf@example.com");
    const expectedUserID = undefined;
    assert.equal(user, expectedUserID);
  });
});