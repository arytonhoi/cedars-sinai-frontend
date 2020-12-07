const { admin, db, production } = require("../util/admin");
// const { formatReqBody } = require("../util/util");
const { firebaseConfig } = require("../util/config");

// upload a thumbnail image
exports.postImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");
  const busboy = new BusBoy({ headers: req.headers });

  let thumbnailFilename;
  let firebaseImageUrl;
  let imageToBeUploaded = {};

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res
        .status(400)
        .json({ error: "Wrong file type submitted. Must be jpg or png" });
    }

    const date = new Date();
    const random_num = Math.round(Math.random() * 1000000000000);
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    const imageFileNamePrefix = `${date.getTime()}_${random_num}`;
    thumbnailFilename = `${imageFileNamePrefix}.${imageExtension}`;
    const filepath = path.join(
      os.tmpdir(),
      `${imageFileNamePrefix}.${imageExtension}`
    );
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });

  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        firebaseImageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${thumbnailFilename}?alt=media`;
        return res.json({ imgUrl: firebaseImageUrl });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);
};

exports.getBannerImage = (req, res) => {
  if (req.method !== "GET") {
    return res.status(400).json({ error: "Method not allowed" });
  }

  db.doc(`/${production}banners/${req.params.pageName}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Banner page not found" });
      }
      return res.json(doc.data());
    });
};

exports.patchBannerImage = (req, res) => {
  if (req.method !== "PATCH") {
    return res.status(400).json({ error: "Method not allowed" });
  }

  const updatedBannerImgObj = { imgUrl: req.body.imgUrl };
  db.doc(`/${production}banners/${req.params.pageName}`)
    .update(updatedBannerImgObj)
    .then(() => {
      return res.json({
        message: `${req.params.pageName} page banner image updated successfully`,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
