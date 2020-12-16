const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const production = "prd_";
// const production = "";
module.exports = { admin, db, production };
