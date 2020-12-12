const { admin, db } = require("../util/admin");
const {
  formatReqBody,
  validateUserIsAdmin,
  returnFormattedHttpError,
} = require("../util/util");

const { firebaseConfig } = require("../util/config");
const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);

// log user in (cookie)
exports.login = (req, res) => {
  req = formatReqBody(req);

  let user;
  // turn username into email
  try {
    user = {
      email: req.body.username.toString().concat("@email.com"),
      password: req.body.password.toString(),
    };
  } catch (err) {
    returnFormattedHttpError(
      res,
      400,
      "Incorrect JSON. Required fields are username and password",
      err
    );
  }

  // When the user signs in with email and password.
  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((userData) => {
      // Get the user's ID token as it is needed to exchange for a session cookie.
      return userData.user.getIdToken().then((idToken) => {
        // expires in 14 days (Firebase maximum limit)
        const expiresIn = 1000 * 60 * 60 * 24 * 14;
        admin
          .auth()
          .createSessionCookie(idToken, { expiresIn })
          .then((sessionCookie) => {
            // Set cookie policy for session cookie.
            const options = {
              maxAge: expiresIn,
              httpOnly: true,
              secure: false, // set to true for HTTPS, false for HTTP
            };
            res.cookie("__session", sessionCookie, options);
            return res.status(200).json({ status: "Login successful" });
          });
      });
    })
    .catch((err) => {
      if (err.code === "auth/wrong-password") {
        returnFormattedHttpError(res, 403, "Incorrect password", err);
      } else if (err.code === "auth/user-not-found") {
        returnFormattedHttpError(res, 403, "Incorrect username", err);
      } else {
        returnFormattedHttpError(
          res,
          500,
          "Server failed to login: please try again",
          err
        );
      }
    });
};

// revoke cookie
exports.logout = (req, res) => {
  let sessionCookie;
  try {
    sessionCookie = req.cookies.__session;
    console.log(`Logging out: ${sessionCookie}`);
  } catch (err) {
    returnFormattedHttpError(
      res,
      403,
      "Logout failed: error reading cookie.",
      err
    );
  }
  res.clearCookie("__session");
  admin
    .auth()
    .verifySessionCookie(sessionCookie)
    .then((decodedClaims) => {
      return admin.auth().revokeRefreshTokens(decodedClaims.sub);
    })
    .then(() => {
      res.status(200).json({ status: "Logout successful" });
    })
    .catch((err) => {
      returnFormattedHttpError(res, 500, "Logout failed.", err);
    });
};

// get own user details
exports.getAuthenticatedUser = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.user.userId}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData = doc.data();
        return res.json(userData);
      } else {
        returnFormattedHttpError(
          res,
          403,
          "Failed to get account details. Please re-login and try again."
        );
      }
    })
    .catch((err) => {
      returnFormattedHttpError(
        res,
        500,
        "Server failed to get account details. Please re-login and try again.",
        err
      );
    });
};

// change user passwordgit
exports.updatePassword = (req, res) => {
  req = formatReqBody(req);
  validateUserIsAdmin(req, res);

  // turn username into email
  let user;
  try {
    user = {
      email: req.body.username.concat("@email.com"),
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
    };
  } catch (err) {
    returnFormattedHttpError(
      res,
      400,
      "Incorrect JSON. Required fields are username, currentPassword, newPassword",
      err
    );
  }

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.currentPassword)
    .then((resUser) => {
      firebase
        .auth()
        .currentUser.updatePassword(user.newPassword)
        .then(() => {
          return res.json({ message: "Password updated successfully" });
        })
        .catch((err) => {
          returnFormattedHttpError(res, 500, err.message, err);
        });
    })
    .catch((err) => {
      returnFormattedHttpError(res, 403, "Current password incorrect", err);
    });
};
