const functions = require("firebase-functions");
const express = require("express");
const app = express();
//const cors = require("cors");
const cookies = require("cookie-parser");
//app.use(cors());
app.use((req, res, next) => {
if(req.headers.origin === undefined){req.headers.origin = "*"}
//console.log(req.headers.origin)
    res.append('Access-Control-Allow-Credentials', 'true');
    res.append('Access-Control-Allow-Origin', req.headers.origin);
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    res.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PATCH, DELETE');
    res.append('Vary','Origin');
    next();
});
app.use(cookies());

const FBAuth = require("./util/fbAuth");
const { admin, db } = require("./util/admin");
const {
  login,
  logout,
  getAuthenticatedUser,
  updatePassword,
} = require("./handlers/users");
const FieldValue = admin.firestore.FieldValue;

const {
  getBannerImage,
  patchBannerImage,
  postImage,
} = require("./handlers/images");

const {
  getAllFolders,
  getFolder,
  createFolder,
  deleteFolder,
  updateOneFolder,
  searchFolders,
} = require("./handlers/folders");

const {
  getAllAnnouncements,
  postOneAnnouncement,
  deleteOneAnnouncement,
  updateOneAnnouncement,
} = require("./handlers/announcements");

const {
  getAllDepartments,
  postOneDepartment,
  deleteOneDepartment,
  updateOneDepartment,
} = require("./handlers/departments");

const {
  getAllContacts,
  postOneContact,
  deleteOneContact,
  updateOneContact,
} = require("./handlers/contacts");

const {
  getDBContents,
  patchDBContents
} = require("./handlers/backup");
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.app = functions.https.onRequest(app);

// NEW ROUTES

// user routes
app.post("/api/login", login);
app.post("/api/logout", logout);
app.get("/api/user", FBAuth, getAuthenticatedUser);
app.patch("/api/user/password", FBAuth, updatePassword);

// image routes
app.post("/api/images", FBAuth, postImage);
app.get("/api/banners/:pageName", FBAuth, getBannerImage);
app.patch("/api/banners/:pageName", FBAuth, patchBannerImage);

// backup routes
app.get("/api/backup", FBAuth, getDBContents);
app.patch("/api/backup", FBAuth, patchDBContents);

// folder routes
app.get("/api/folders", FBAuth, getAllFolders);
app.get("/api/folders/:folderId", FBAuth, getFolder);
app.get("/api/folders/search/:searchTerm", FBAuth, searchFolders);
app.post("/api/folders/:folderId", FBAuth, createFolder);
app.delete("/api/folders/:folderId", FBAuth, deleteFolder);
app.patch("/api/folders/:folderId", FBAuth, updateOneFolder);

// announcement routes
app.get("/api/announcements", FBAuth, getAllAnnouncements);
app.post("/api/announcements", FBAuth, postOneAnnouncement);
app.delete("/api/announcements/:announcementId", FBAuth, deleteOneAnnouncement);
app.patch("/api/announcements/:announcementId", FBAuth, updateOneAnnouncement);

// contacts
app.get("/api/departments", FBAuth, getAllDepartments);
app.post("/api/departments", FBAuth, postOneDepartment);
app.delete("/api/departments/:departmentId", FBAuth, deleteOneDepartment);
app.patch("/api/departments/:departmentId", FBAuth, updateOneDepartment);
app.get("/api/contacts", FBAuth, getAllContacts);
app.post("/api/contacts", FBAuth, postOneContact);
app.delete("/api/contacts/:contactId", FBAuth, deleteOneContact);
app.patch("/api/contacts/:contactId", FBAuth, updateOneContact);

exports.onDepartmentDelete = functions.firestore
  .document("/departments/{departmentId}")
  .onDelete((snapshot, context) => {
    const departmentId = context.params.departmentId;
    const batch = db.batch();
    return db
      .collection("contacts")
      .where("departmentId", "==", departmentId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/contacts/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => console.error(err));
  });

exports.onFolderDelete = functions.firestore
  .document("/folders/{folderId}")
  .onDelete((snapshot, context) => {
    const folderId = context.params.folderId;
    const batch = db.batch();
    const folderPathsMapRef = db.collection("paths").doc("folders");
    return db
      .collection("folders")
      .where("parent", "==", folderId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          const docId = doc.id;
          batch.update(folderPathsMapRef, { [docId]: FieldValue.delete() });
          batch.delete(db.doc(`/folders/${docId}`));
        });
        return batch.commit();
      })
      .catch((err) => console.error(err));
  });
