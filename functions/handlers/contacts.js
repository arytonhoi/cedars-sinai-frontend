const { admin, db } = require("../util/admin");
const {
  convertToPlainObject,
  formatReqBody,
  validateUserIsAdmin,
  returnFormattedHttpError,
} = require("../util/util");
const { Contact, DEFAULT_CONTACT_IMG_URL } = require("../models/contact");

// get all contacts in database
exports.getAllContacts = (req, res) => {
  db.collection(`contacts`)
    .get()
    .then((data) => {
      let contacts = [];
      data.forEach((doc) => {
        let contact = doc.data();
        contact.id = doc.id;
        contacts.push(contact);
      });
      return res.json(contacts);
    })
    .catch((err) => {
      let msg = "Failed to get contacts. Please refresh and try again.";
      returnFormattedHttpError(res, 500, msg, err);
    });
};

/**
 * Create and return Contact object instance from request body for POST'ing new contacts.
 */
function createNewContactObj(req, res) {
  let newContact;
  try {
    newContact = new Contact(
      req.body.departmentId,
      req.body.name,
      req.body.imgUrl,
      req.body.phone,
      req.body.email
    );

    // Add default contact img if none is provided
    if (newContact.imgUrl === "" || typeof newContact.imgUrl === "undefined") {
      newContact.imgUrl = DEFAULT_CONTACT_IMG_URL;
    }
  } catch (err) {
    msg = "JSON incomplete. Required keys are: departmentId, name, phone, email";
    return returnFormattedHttpError(res, 400, msg, err);
  }
  return newContact;
}

/**
 * Post new Contact to Firestore.
 * @param  {[type]} req API request
 * @param  {[type]} res API response
 */
exports.postContact = (req, res) => {
  req = formatReqBody(req);
  validateUserIsAdmin(req, res);

  let newContact = createNewContactObj(req, res);

  // Upload newContact to Firestore
  db.collection(`contacts`)
    .add(convertToPlainObject(newContact))
    .then((doc) => {
      newContact.id = doc.id;
      res.json(newContact);
    })
    .catch((err) => {
      let msg = "Failed to add contact. Please refresh and try again.";
      returnFormattedHttpError(res, 500, msg, err);
    });
};

/**
 * Create and return Contact object instance from request body for updating existing contacts.
 */
function createUpdatedContactObj(req, res) {
  let updatedContact = {};
  if (typeof req.body.departmentId !== "undefined")
    updatedContact.departmentId = req.body.departmentId;
  if (typeof req.body.name !== "undefined") updatedContact.name = req.body.name;
  if (typeof req.body.imgUrl !== "undefined") updatedContact.imgUrl = req.body.imgUrl;
  if (typeof req.body.phone !== "undefined") updatedContact.phone = req.body.phone;
  if (typeof req.body.email !== "undefined") updatedContact.email = req.body.email;

  if (Object.keys(updatedContact).length === 0 && updatedContact.constructor === Object) {
    let msg = "Failed to update contact. Must update at least one field.";
    returnFormattedHttpError(res, 400, msg);
  }

  return updatedContact;
}

/**
 * Delete old contact image from Firebase Storage if
 * This doesn't
 */
function deleteOldContactImage(oldContactObj) {
  if (typeof oldContactObj.imgUrl === "undefined") {
    console.log("No imgUrl to delete");
    return;
  }
  if (typeof oldContactObj.imgUrl === DEFAULT_CONTACT_IMG_URL) {
    console.log("Cannot delete default image");
    return;
  }

  // Extracts filename from imgUrl
  // from: https://firebasestorage.googleapis.com/v0/b/cedars-sinai-prd.appspot.com/o/cedars_robot.jpg?alt=media
  // to: cedars_robot.jpg
  const re = /\/o\/(.*)\?alt=media/g;
  const matches = re.exec(oldContactObj.imgUrl);
  if (matches !== null) {
    const currentContactImgFilename = matches[1];
    admin.storage().bucket().file(currentContactImgFilename).delete();
    console.log(`Deleted image: ${currentContactImgFilename}`);
  } else {
    console.log(`Failed to delete old image: ${oldContactObj.imgUrl}`);
  }
}

/**
 * Update existing Contact on Firestore.
 * @param  {[type]} req API request
 * @param  {[type]} res API response
 */
exports.updateContact = (req, res) => {
  req = formatReqBody(req);
  validateUserIsAdmin(req, res);

  // move request params to JS object newFIle
  const updatedContact = createUpdatedContactObj(req, res);
  const contactRef = db.doc(`/contacts/${req.params.contactId}`);
  contactRef
    .get()
    .then((doc) => {
      if (!doc.exists) {
        let msg = "Failed to update contact. Given id does not match any existing contacts.";
        return returnFormattedHttpError(res, 404, msg);
      }
      let contact = doc.data();
      // Delete old image file from Firebase storage to save space if:
      // - uploading a new image AND
      // -  the old image isn't the default contact image
      if (
        contact.imgUrl !== DEFAULT_CONTACT_IMG_URL &&
        contact.imgUrl !== updatedContact.imgUrl &&
        typeof updatedContact.imgUrl !== "undefined"
      ) {
        deleteOldContactImage(contact);
      }
      return contactRef.update(updatedContact);
    })
    .then(() => {
      return res.json({ message: "Contact updated successfully " });
    })
    .catch((err) => {
      let msg = "Failed to update contact. Please refresh and try again.";
      returnFormattedHttpError(res, 500, msg, err);
    });
};

/**
 * Deletes existing Contact from Firestore.
 * @param  {[type]} req API request
 * @param  {[type]} res API response
 */
exports.deleteContact = (req, res) => {
  validateUserIsAdmin(req, res);
  const contactRef = db.doc(`/contacts/${req.params.contactId}`);
  contactRef
    .get()
    .then((doc) => {
      if (!doc.exists) {
        let msg = "Failed to update contact. Given id does not match any existing contacts.";
        returnFormattedHttpError(res, 404, msg);
      }
      let contact = doc.data();
      // Delete old image file from Firebase storage to save space if it isn't the default image.
      if (contact.imgUrl !== DEFAULT_CONTACT_IMG_URL) deleteOldContactImage(contact);
      return contactRef.delete();
    })
    .then(() => {
      res.json({ message: "Contact deleted successfully" });
    })
    .catch((err) => {
      let msg = "Failed to delete contact. Please refresh and try again.";
      returnFormattedHttpError(res, 500, msg, err);
    });
};
