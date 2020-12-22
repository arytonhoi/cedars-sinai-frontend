// logs and returns errors
exports.returnFormattedHttpError = (res, code, message = "", err = null) => {
  if (err) {
    console.log(`${code}: ${err} - ${message}`);
  }

  return res.status(code).json({ message: message });
};

exports.formatReqBody = (req, res) => {
  try {
    req.body = JSON.parse(req.rawBody.toString());
    return req;
  } catch (err) {
    return this.returnFormattedHttpError(res, 400, "Invalid JSON", err);
  }
};

exports.validateUserIsAdmin = (req, res) => {
  if (!req.user.isAdmin) {
    this.returnFormattedHttpError(
      res,
      403,
      "User not nauthorized to call this endpoint"
    );
  }
};

exports.validateReqBodyFields = (req, schema, res) => {
  try {
    let reqSchema = req.body;
    Object.keys(reqSchema).forEach((key) => {
      if (!(key in schema)) {
        return this.returnFormattedHttpError(
          res,
          400,
          `Update JSON body contains invalid key: ${key}`
        );
      }
    });
  } catch (err) {
    return this.returnFormattedHttpError(
      res,
      400,
      "Update JSON body is invalid",
      err
    );
  }
};
