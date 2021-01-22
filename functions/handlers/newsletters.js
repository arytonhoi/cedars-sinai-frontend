const { db } = require("../util/admin");
const { formatReqBody, validateUserIsAdmin, returnFormattedHttpError } = require("../util/util");

exports.getNewsletters = (req, res) => {
  // check for param queries
  let fromDate;
  let toDate;
  let defaultTimeSpan = 31536000000; // past year in milliseconds
  if (req.query.fromDate) {
    try {
      fromDate = new Date(parseInt(req.query.fromDate)).toISOString();
    } catch (err) {
      returnFormattedHttpError(
        res,
        400,
        "Invalid param query. Options are fromDate and toDate.",
        err
      );
    }
  } else {
    fromDate = new Date(Date.now() - defaultTimeSpan).toISOString();
  }

  if (req.query.toDate) {
    try {
      toDate = new Date(parseInt(req.query.toDate)).toISOString();
    } catch (err) {
      returnFormattedHttpError(
        res,
        400,
        "Invalid param query. Options are fromDate and toDate.",
        err
      );
    }
  } else {
    toDate = new Date().toISOString();
  }

  db.collection(`newsletters`)
    .orderBy("createdAt", "desc")
    .where("createdAt", ">=", fromDate)
    .where("createdAt", "<=", toDate)
    .get()
    .then((data) => {
      let newsletters = [];
      data.forEach((doc) => {
        let newsletter = doc.data();
        newsletter.id = doc.id;
        newsletters.push(newsletter);
      });
      return res.json(newsletters);
    })
    .catch((err) => {
      returnFormattedHttpError(
        res,
        500,
        "Failed to get newsletters. Please refresh and try again.",
        err
      );
    });
};

exports.postNewsletter = (req, res) => {
  req = formatReqBody(req);
  validateUserIsAdmin(req, res);

  // move request params to JS object newFIle
  let newNewsletter;
  try {
    newNewsletter = {
      title: req.body.title,
      url: req.body.url,
      createdAt: new Date().toISOString(),
    };
  } catch (err) {
    returnFormattedHttpError(
      res,
      400,
      "JSON incomplete. Required keys are title, url, createdAt",
      err
    );
  }

  // add newNewsletter to FB database
  db.collection(`newsletters`)
    .add(newNewsletter)
    .then((doc) => {
      newNewsletter.id = doc.id;
      res.json(newNewsletter);
    })
    .catch((err) => {
      returnFormattedHttpError(
        res,
        500,
        "Failed to add newsletter. Please refresh and try again.",
        err
      );
    });
};

exports.deleteNewsletter = (req, res) => {
  validateUserIsAdmin(req, res);

  const newsletter = db.doc(`/newsletters/${req.params.newsletterId}`);
  newsletter
    .get()
    .then((doc) => {
      if (!doc.exists) {
        returnFormattedHttpError(
          res,
          404,
          "Failed to delete newsletter. Given id does not match any newsletters."
        );
      } else {
        return newsletter.delete();
      }
    })
    .then(() => {
      res.json({ message: "Newsletter deleted successfully" });
    })
    .catch((err) => {
      returnFormattedHttpError(
        res,
        500,
        "Failed to delete newsletter. Please refresh and try again.",
        err
      );
    });
};

exports.updateNewsletter = (req, res) => {
  req = formatReqBody(req);
  validateUserIsAdmin(req, res);

  // move request params to JS object newFIle
  let updatedNewsletter;
  try {
    updatedNewsletter = {
      title: req.body.title,
      url: req.body.url,
    };
  } catch (err) {
    returnFormattedHttpError(res, 400, "JSON incomplete. Required keys are title and url", err);
  }

  db.doc(`/newsletters/${req.params.newsletterId}`)
    .update(updatedNewsletter)
    .then(() => {
      return res.json({ message: "Newsletter updated successfully " });
    })
    .catch((err) => {
      returnFormattedHttpError(
        res,
        500,
        "Failed to update newsletter. Please refresh and try again.",
        err
      );
    });
};
