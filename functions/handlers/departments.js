const { db } = require("../util/admin");
const { formatReqBody, validateUserIsAdmin, returnFormattedHttpError } = require("../util/util");

// get all departments in database
exports.getAllDepartments = (req, res) => {
  db.collection(`departments`)
    .get()
    .then((data) => {
      let departments = [];
      data.forEach((doc) => {
        let department = doc.data();
        department.id = doc.id;
        departments.push(department);
      });
      return res.json(departments);
    })
    .catch((err) => {
      returnFormattedHttpError(
        res,
        500,
        "Failed to get departments. Please refresh and try again.",
        err
      );
    });
};

// create file
exports.postOneDepartment = (req, res) => {
  req = formatReqBody(req);
  validateUserIsAdmin(req, res);

  // move request params to JS object newFIle
  let newDepartment;
  try {
    newDepartment = {
      name: req.body.name,
    };
  } catch (err) {
    returnFormattedHttpError(res, 400, "JSON incomplete. Required keys are name", err);
  }

  // add newAnn to FB database and update parent folder
  db.collection(`departments`)
    .add(newDepartment)
    .then((doc) => {
      newDepartment.id = doc.id;
      res.json(newDepartment);
    })
    .catch((err) => {
      returnFormattedHttpError(
        res,
        400,
        "Failed to add department. Please refresh and try again.",
        err
      );
    });
};

exports.deleteOneDepartment = (req, res) => {
  validateUserIsAdmin(req, res);

  const department = db.doc(`/departments/${req.params.departmentId}`);
  department
    .get()
    .then((doc) => {
      if (!doc.exists) {
        returnFormattedHttpError(
          res,
          404,
          "Failed to delete department. Given id does not match any departments."
        );
      } else {
        return department.delete();
      }
    })
    .then(() => {
      res.json({ message: "Department deleted successfully" });
    })
    .catch((err) => {
      returnFormattedHttpError(
        res,
        500,
        "Failed to delete department. Please refresh and try again."
      );
    });
};

exports.updateOneDepartment = (req, res) => {
  req = formatReqBody(req);
  validateUserIsAdmin(req, res);

  let updatedDepartment;
  try {
    updatedDepartment = {
      name: req.body.name,
    };
  } catch (err) {
    returnFormattedHttpError(res, 400, "JSON incomplete. Required keys are name", err);
  }

  db.doc(`/departments/${req.params.departmentId}`)
    .update(updatedDepartment)
    .then(() => {
      return res.json({ message: "Department updated successfully" });
    })
    .catch((err) => {
      returnFormattedHttpError(
        res,
        500,
        "Failed to update department. Please refresh and try again."
      );
    });
};
