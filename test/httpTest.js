const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;

chai.use(chaiHttp);

describe("Register, Login, and Access Control Test", () => {
  const agent = chai.request.agent("http://localhost:8080");

  it('should return 403 status code for unauthorized access to "/urls/b2xVn2"', () => {
    // Step 1: Register a new user
    return agent
      .post("/register")
      .send({ email: "user2@example.com", password: "dishwasher-funk" })
      .then((registerRes) => {
        // Make sure registration was successful
        expect(registerRes).to.have.status(200);

        // Step 2: Make a GET request to a protected resource
        return agent.get("/urls/b2xVn2").then((accessRes) => {
          // Step 3: Expect the status code to be 403
          expect(accessRes).to.have.status(403);
        });
      });
  });

  // Close agent connection after all tests
  after(() => {
    agent.close();
  });
});

describe('Access Control Tests', () => {
  const agent = chai.request.agent('http://localhost:8080');

  it('should redirect GET request to "/" to "/login" with status code 302', () => {
    return agent
      .get('/')
      .redirects(1)
      .then(res => {
        expect(res).to.redirect;
        expect(res).to.have.status(200);
        expect(res).to.redirectTo('http://localhost:8080/login');
      });
  });

  it('should redirect GET request to "/urls/new" to "/login" with status code 302', () => {
    return agent
      .get('/urls/new')
      .redirects(1)
      .then(res => {
        expect(res).to.redirect;
        expect(res).to.have.status(200);
        expect(res).to.redirectTo('http://localhost:8080/login');
      });
  });

  it('should return 404 status code for GET request to "/urls/NOTEXISTS"', () => {
    return agent
      .get('/urls/NOTEXISTS')
      .then(res => {
        expect(res).to.have.status(404);
      });
  });

  it('should return 403 status code for GET request to "/urls/b2xVn2"', () => {
    return agent
      .get('/urls/b2xVn2')
      .then(res => {
        expect(res).to.have.status(403);
      });
  });

  // Close agent connection after all tests
  after(() => {
    agent.close();
  });
});