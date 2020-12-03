const { admin, db } = require("../util/admin");
const { formatReqBody } = require("../util/util");

exports.getDBContents = (req, res) => {
  if (req.method !== "GET") {
    return res.status(400).json({ error: "Method not allowed" });
  }
  if (req.user.isAdmin) {
    var database = {};
    db.listCollections().then((all) =>
      Promise.all(
        all.map((col) =>
          db
            .collection(col.id)
            .get()
            .then((doc) => {
              database[col.id] = {};
              doc.forEach((x) => {
                database[col.id][x.id] = x.data();
              });
            })
            .catch((err) => {
              console.error(err);
              res.status(500).json({ error: `Error backing up ${col.id}` });
            })
        )
      ).then((x) => res.json(database))
    );
  } else {
    res.status(403).json({ error: "Backups may only be made by admins." });
  }
};

exports.patchDBContents = (req, res) => {
  if (req.method !== "PATCH") {
    return res.status(400).json({ error: "Method not allowed" });
  }
  try {
    req = formatReqBody(req);
  } catch (e) {
    return res.status(400).json({ error: "Incorrect backup format" });
  }
  if (req.user.isAdmin) {
    var database = req.body;
    var ckeys = Object.keys(database);
    if (ckeys.length === 0) {
      return res
        .status(400)
        .json({ error: "Empty object, nothing was changed" });
    }
    Promise.all(
      ckeys.map(async (x) => {
        var dkeys = Object.keys(database[x]);
        if (dkeys.length > 0) {
          if (dkeys.length >= 500) {
            var c = [...dkeys];
            dkeys = [];
            while (c.length > 0) {
              dkeys.push(c.slice(0, 500));
              c = c.slice(500);
            }
          } else {
            dkeys = [dkeys];
          }
          await Promise.all(
            dkeys.map(async (y) => {
              var batch = db.batch();
              y.forEach((z) => {
                batch.set(db.collection(x).doc(z), database[x][z]);
              });
              await batch.commit();
            })
          ).catch((err) =>
            res.status(500).json({ error: `Error restoring collection ${x}.` })
          );
        }
      })
    )
      .then((x) => res.json({ message: "Database successfully updated." }))
      .catch((err) =>
        res.status(500).json({ error: "Error restoring from backup." })
      );
  } else {
    res.status(403).json({ error: "Only admins can update the database." });
  }
};
