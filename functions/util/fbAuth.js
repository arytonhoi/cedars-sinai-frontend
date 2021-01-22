const { admin, db } = require("./admin");
const { returnFormattedHttpError } = require("../util/util");

// cookie
module.exports = FBAuth = (req, res, next) => {
  let sessionCookie;
  console.log(req.cookies);
  sessionCookie = req.cookies["__session"];
  if (sessionCookie === undefined) {
    returnFormattedHttpError(
      res,
      403,
      "Authentication cookie not provided. Please re-login and try again."
    );
  }

  admin
    .auth()
    .verifySessionCookie(sessionCookie, true)
    .then((decodedClaims) => {
      req.user = decodedClaims;
      return db.collection("users").where("userId", "==", req.user.uid).limit(1).get();
    })
    .then((data) => {
      if (data.docs.length < 1) {
        returnFormattedHttpError(res, 403, "Authentication failed. Please re-login and try again.");
      }
      req.user.userId = data.docs[0].id;
      req.user.email = data.docs[0].data().email;
      req.user.isAdmin = data.docs[0].data().isAdmin;
      return next();
    })
    .catch((err) => {
      returnFormattedHttpError(
        res,
        403,
        "Error verifying authentication cookie. Please re-login and try again.",
        err
      );
    });
};
