const { db } = require("../util/admin");
const { formatReqBody, validateUserIsAdmin, returnFormattedHttpError } = require("../util/util");

// const defaultContactPic = `https://firebasestorage.googleapis.com/v0/b/fir-db-d2d47.appspot.com/o/
// cedars_robot_1080x1080.jpg?alt=media&token=0932153f-e1e3-4f47-b419-fd5ae76abd34`;
const defaultContactPic = `https://firebasestorage.googleapis.com/v0/b/cedars-sinai-prd.appspot.com/o/cedars_robot.jpg?alt=media`;

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
      returnFormattedHttpError(
        res,
        500,
        "Failed to get contacts. Please refresh and try again.",
        err
      );
    });
};

// create file
exports.postOneContact = (req, res) => {
  req = formatReqBody(req);
  validateUserIsAdmin(req, res);

  // move request params to JS object newFIle
  let newContact;
  try {
    newContact = {
      departmentId: req.body.departmentId,
      name: req.body.name,
      imgUrl: req.body.imgUrl,
      phone: req.body.phone,
      email: req.body.email,
    };
    // insert default image url
    if (newContact.imgUrl === "") {
      newContact.imgUrl = defaultContactPic;
    }
  } catch (err) {
    returnFormattedHttpError(
      res,
      400,
      "JSON incomplete. Required keys are departmentId, name, imgUrl, phone, email",
      err
    );
  }

  // add newContact to FB database and update parent folder
  db.collection(`contacts`)
    .add(newContact)
    .then((doc) => {
      newContact.id = doc.id;
      res.json(newContact);
    })
    .catch((err) => {
      returnFormattedHttpError(
        res,
        500,
        "Failed to add contact. Please refresh and try again.",
        err
      );
    });
};

exports.deleteOneContact = (req, res) => {
  validateUserIsAdmin(req, res);

  const contact = db.doc(`/contacts/${req.params.contactId}`);
  contact
    .get()
    .then((doc) => {
      if (!doc.exists) {
        returnFormattedHttpError(
          res,
          404,
          "Failed to delete contact. Given id does not match any contacts."
        );
      } else {
        return contact.delete();
      }
    })
    .then(() => {
      res.json({ message: "Contact deleted successfully" });
    })
    .catch((err) => {
      returnFormattedHttpError(
        res,
        500,
        "Failed to delete contact. Please refresh and try again.",
        err
      );
    });
};

exports.updateOneContact = (req, res) => {
  req = formatReqBody(req);
  validateUserIsAdmin(req, res);

  // move request params to JS object newFIle
  let updatedContact;
  try {
    updatedContact = {
      departmentId: req.body.departmentId,
      name: req.body.name,
      imgUrl: req.body.imgUrl,
      phone: req.body.phone,
      email: req.body.email,
    };
  } catch (err) {
    returnFormattedHttpError(
      res,
      400,
      "JSON incomplete. Required keys are departmentId, name, imgUrl, phone, email",
      err
    );
  }

  db.doc(`/contacts/${req.params.contactId}`)
    .update(updatedContact)
    .then(() => {
      return res.json({ message: "Contact updated successfully " });
    })
    .catch((err) => {
      returnFormattedHttpError(
        res,
        500,
        "Failed to update contact. Please refresh and try again.",
        err
      );
    });
};
