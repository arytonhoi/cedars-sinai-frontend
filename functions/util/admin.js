const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const production = "";
module.exports = { admin, db, production }
