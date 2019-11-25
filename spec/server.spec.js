// const chaiHttp = require("chai-http");
// const chai = require("chai");
// const app = require("../app");
// require("dotenv").config();

// const dbConnect = require("../models/index");

// chai.use(chaiHttp);
// const expect = chai.expect;

// describe("Test with mongoDB database", function() {
//   dbConnect();

//   describe("POST /register", function() {
//     it("should check user info", function(done) {
//       this.timeout(10000);
//       chai
//         .request(app)
//         .post("/register")
//         .send({
//           email: "wooder2050@gmail.com",
//           password: "123456",
//           password2: "123456"
//         })
//         .end(function(err, res) {
//           if (err) return done(err);
//           expect(err).to.be.not.ok;
//           expect(res.status).to.equal(401);
//           expect(typeof res.body).to.equal("object");
//           expect(res.body.register_authenticated).to.equal(false);
//           expect(res.body.register_message).to.equal(
//             "Same email already exists"
//           );
//           expect(res.body.register_emailError).to.equal(
//             "Same email already exists"
//           );
//           done();
//         });
//     });
//   });
// });
