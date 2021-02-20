const DEFAULT_CONTACT_IMG_URL = `https://firebasestorage.googleapis.com/v0/b/cedars-sinai-prd.appspot.com/o/cedars_robot.jpg?alt=media`;

/**
 * Contact object constructor.
 * @param {String} departmentId Firebase auto-id of contact's department
 * @param {String} name Full name of contact
 * @param {String} imgUrl Link to contact's image
 * @param {String} phone Phone number
 * @param {String} email Email address
 */

function Contact(departmentId, name, imgUrl, phone, email) {
  if (typeof departmentId === "undefined") throw "departmentId missing";
  if (typeof name === "undefined") throw "name missing";
  if (typeof phone === "undefined") throw "phone missing";
  if (typeof email === "undefined") throw "email missing";
  this.departmentId = departmentId;
  this.name = name;
  this.imgUrl = imgUrl;
  this.phone = phone;
  this.email = email;
}

//   Contact.prototype.x = function() { ... };

module.exports = { Contact, DEFAULT_CONTACT_IMG_URL };
