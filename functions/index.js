const functions = require("firebase-functions");
const express = require("express");
const app = express();
const cookies = require("cookie-parser");
app.use((req, res, next) => {
  if (req.headers.origin === undefined) {
    req.headers.origin = "*";
  }
  //req.rawBody = "";
  //req.on("data",function(c){req.rawBody += c})
  //console.log(req.headers.origin)
  res.append("Access-Control-Allow-Credentials", "true");
  res.append("Access-Control-Allow-Origin", req.headers.origin);
  res.append("Access-Control-Allow-Headers", "Content-Type");
  res.append("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PATCH, DELETE");
  res.append("Vary", "Origin");
  //req.on('end',function(){next()});
  next();
});
app.use(cookies());

const FBAuth = require("./util/fbAuth");
const { admin, db } = require("./util/admin");
const {
  backdoorLogin,
  login,
  logout,
  getAuthenticatedUser,
  updatePassword,
} = require("./handlers/users");
const FieldValue = admin.firestore.FieldValue;

const { getBannerImage, patchBannerImage, postImage } = require("./handlers/images");

const {
  getAllFolders,
  getFolder,
  createFolder,
  deleteFolder,
  updateFolder,
  searchFolders,
} = require("./handlers/folders");

const {
  getAnnouncements,
  postAnnouncement,
  deleteAnnouncement,
  updateAnnouncement,
} = require("./handlers/announcements");

const {
  getNewsletters,
  postNewsletter,
  deleteNewsletter,
  updateNewsletter,
} = require("./handlers/newsletters");

const {
  getAllDepartments,
  postDepartment,
  deleteDepartment,
  updateDepartment,
} = require("./handlers/departments");

const {
  getAllContacts,
  postContact,
  deleteContact,
  updateContact,
} = require("./handlers/contacts");

const {
  getCalendar,
  editCalendar,
  editCalendarEvent,
  deleteCalendar,
  deleteCalendarEvent,
  createCalendar,
  createCalendarEvent,
  getCalendarList,
  getCalendarAcl,
  addCalendarAcl,
} = require("./handlers/calendar");

const { sendEmail } = require("./handlers/email");

const { fetchWhois } = require("./handlers/website");

const { getDBContents, patchDBContents } = require("./handlers/backup");
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.app = functions.https.onRequest(app);

// NEW ROUTES

// user routes
app.post("/api/login", login);
app.post("/api/backdoorLogin", backdoorLogin);
app.post("/api/logout", FBAuth, logout);
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
app.patch("/api/folders/:folderId", FBAuth, updateFolder);

// announcement routes
app.get("/api/announcements", FBAuth, getAnnouncements);
app.post("/api/announcements", FBAuth, postAnnouncement);
app.delete("/api/announcements/:announcementId", FBAuth, deleteAnnouncement);
app.patch("/api/announcements/:announcementId", FBAuth, updateAnnouncement);

// newsletter
app.get("/api/newsletters", FBAuth, getNewsletters);
app.post("/api/newsletters", FBAuth, postNewsletter);
app.delete("/api/newsletters/:newsletterId", FBAuth, deleteNewsletter);
app.patch("/api/newsletters/:newsletterId", FBAuth, updateNewsletter);

// contacts
app.get("/api/departments", FBAuth, getAllDepartments);
app.post("/api/departments", FBAuth, postDepartment);
app.delete("/api/departments/:departmentId", FBAuth, deleteDepartment);
app.patch("/api/departments/:departmentId", FBAuth, updateDepartment);
app.get("/api/contacts", FBAuth, getAllContacts);
app.post("/api/contacts", FBAuth, postContact);
app.delete("/api/contacts/:contactId", FBAuth, deleteContact);
app.patch("/api/contacts/:contactId", FBAuth, updateContact);

// calendar routes
app.get("/api/calendar", FBAuth, getCalendarList);
app.get("/api/calendar/:calendarId", FBAuth, getCalendar);
app.post("/api/calendar/:calendarId/events", FBAuth, createCalendarEvent);
app.delete("/api/calendar/:calendarId/events/:eventId", FBAuth, deleteCalendarEvent);
app.patch("/api/calendar/:calendarId/events/:eventId", FBAuth, editCalendarEvent);
app.get("/api/calendar/:calendarId/access", FBAuth, getCalendarAcl);
app.post("/api/calendar", FBAuth, createCalendar);
app.post("/api/calendar/:calendarId/access", FBAuth, addCalendarAcl);
app.patch("/api/calendar/:calendarId", FBAuth, editCalendar);
app.delete("/api/calendar/:calendarId", FBAuth, deleteCalendar);

// email routes
app.post("/api/email", FBAuth, sendEmail);

// whois routes
app.get("/api/whois", FBAuth, fetchWhois);
app.get("/api/whois/:domain", FBAuth, fetchWhois);

// Firebase triggers

// When department is deleted, delete its contacts
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

// When folder is deleted, delete child folders and path references
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

// exports.onProdDepartmentDelete = functions.firestore
//   .document("/prd_departments/{departmentId}")
//   .onDelete((snapshot, context) => {
//     const departmentId = context.params.departmentId;
//     const batch = db.batch();
//     return db
//       .collection("prd_contacts")
//       .where("departmentId", "==", departmentId)
//       .get()
//       .then((data) => {
//         data.forEach((doc) => {
//           batch.delete(db.doc(`/prd_contacts/${doc.id}`));
//         });
//         return batch.commit();
//       })
//       .catch((err) => console.error(err));
//   });

// exports.onProdFolderDelete = functions.firestore
//   .document("/prd_folders/{folderId}")
//   .onDelete((snapshot, context) => {
//     const folderId = context.params.folderId;
//     const batch = db.batch();
//     const folderPathsMapRef = db.collection("prd_paths").doc("folders");
//     return db
//       .collection("prd_folders")
//       .where("parent", "==", folderId)
//       .get()
//       .then((data) => {
//         data.forEach((doc) => {
//           const docId = doc.id;
//           batch.update(folderPathsMapRef, { [docId]: FieldValue.delete() });
//           batch.delete(db.doc(`/prd_folders/${docId}`));
//         });
//         return batch.commit();
//       })
//       .catch((err) => console.error(err));
//   });
