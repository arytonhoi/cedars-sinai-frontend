const { admin, db } = require("../util/admin");
const { formatReqBody, validateUserIsAdmin, returnFormattedHttpError } = require("../util/util");

const { firebaseConfig } = require("../util/config");
const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);

// log user in (cookie)
exports.login = (req, res) => {
  req = formatReqBody(req);

  let user;
  let attemptFirebaseAuth = true;
  // turn username into email
  try {
    user = {
      email: req.body.username.toString().concat("@cedarsoreducation.com"),
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

  // firebase blocks an account after too many failed logins
  // keep this feature for admin account, but bypass it for staff accounts
  db.doc(`/passwords/${user.email}`)
    .get()
    .then((doc) => {
      if (user.email === "staff@cedarsoreducation.com") {
        attemptFirebaseAuth = false;
        if (!doc.exists) {
          return returnFormattedHttpError(res, 403, "Incorrect username");
        } else {
          // checking staff "password"
          userPasswordData = doc.data();
          if (user.password !== userPasswordData.password) {
            return returnFormattedHttpError(res, 403, "Incorrect password!");
          }
          user.password = userPasswordData.password;
          attemptFirebaseAuth = true;
        }
      }
      if (attemptFirebaseAuth) {
        // try authenicating via Firebase with email and password, send auth cookie if successful
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
              returnFormattedHttpError(res, 500, "Server failed to login: please try again", err);
            }
          });
      }
    });
};

// dev login
exports.backdoorLogin = (req, res) => {
  req = formatReqBody(req);

  let user;
  try {
    user = {
      email: req.body.email.toString(),
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

  // send auth cookie if successful
  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((userData) => {
      // Get the user's ID token as it is needed to exchange for a session cookie.
      return userData.user.getIdToken().then((idToken) => {
        // expires in 1 day
        const expiresIn = 1000 * 60 * 60 * 24;
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
        returnFormattedHttpError(res, 500, "Server failed to login: please try again", err);
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
    returnFormattedHttpError(res, 403, "Logout failed: error reading cookie.", err);
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

// change user password
exports.updatePassword = (req, res) => {
  req = formatReqBody(req);
  validateUserIsAdmin(req, res);

  // turn username into email
  let user;
  try {
    user = {
      email: req.body.username.concat("@cedarsoreducation.com"),
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

  // firebase blocks an account after too many failed logins
  // keep this feature for admin account, but bypass it for staff accounts
  if (user.email === "staff@cedarsoreducation.com") {
    const userPasswordRef = db.collection(`passwords`).doc(user.email);
    userPasswordRef.get().then((doc) => {
      if (!doc.exists) {
        return returnFormattedHttpError(res, 403, "Incorrect username");
      } else {
        userPasswordData = doc.data();
        if (user.currentPassword !== userPasswordData.password) {
          return returnFormattedHttpError(res, 403, "Incorrect password");
        }
        // update fake staff password
        userPasswordRef.update({ password: user.newPassword });
        // return res.json({ message: "Password updated successfully" });
      }
    });
  }

  // attempt to change password normally via actual Firebase auth
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
