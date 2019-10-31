const request = require("supertest");
const should = require("should");
const chai = require("chai");
const expect = require("chai").expect;
var sinon = require("sinon");

const app = require("../app");
var httpMocks = require("node-mocks-http");

describe("GET / login failed", () => {
  it("should send status 401", done => {
    request(app)
      .get("/login/failed")
      .expect(401)
      .end((err, res) => {
        expect(res.body.message).to.equal("user failed to authenticate.");
        done();
      });
  });
});

describe("GET / logout", () => {
  it("should send status 200 and {authenticated: false}", done => {
    request(app)
      .get("/logout")
      .expect(200)
      .end((err, res) => {
        expect(res.body.authenticated).to.equal(false);
        done();
      });
  });
});
//비동기, req mock 작업
// describe("POST / posts/upload", () => {
//   it("should send status 200 and { userPost: true}", done => {
//     request(app)
//       .post("/posts/upload")
//       .expect(200)
//       .end((err, res) => {
//         expect(res.body.userPost).to.equal(true);
//         done();
//       });
//   });
// });
