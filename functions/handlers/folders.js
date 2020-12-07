const { admin, db, production } = require("../util/admin");
const {
  formatReqBody,
  validateUserIsAdmin,
  returnFormattedHttpError,
} = require("../util/util");
const FieldValue = admin.firestore.FieldValue;

// util functions
function getFolderPath(folderPathsMap, folderId) {
  const folderPath = [];
  let currentFolderId = folderId;
  while (currentFolderId && currentFolderId !== "") {
    console.log(currentFolderId);
    let folderPathsMapContent = folderPathsMap[currentFolderId];
    folderPathsMapContent.id = currentFolderId;
    folderPath.push(folderPathsMapContent);
    currentFolderId = folderPathsMapContent.parentId;
  }
  folderPath.reverse();
  return folderPath;
}

function boldFolderContentSearchMatches(string, searchKey) {
  let stripHTMLRegex = new RegExp(
    `<\\/? *[a-zA-Z0-9]+( *[a-zA-Z0-9]+ *= *['"].+?['"])* *\\/? *>`,
    "gi"
  );
  let findMatchStringRegex = new RegExp(
    `(((\\w+\\W+){5}|^.*?)[^ ]*${searchKey}[^ ]*((\\W+\\w+){5}|.*?$))`,
    "gim"
  );
  let boldMatchStringRegex = new RegExp(`${searchKey}`, "gi");
  string = string.replace(stripHTMLRegex, "");
  var matches = string.match(findMatchStringRegex);
  if (matches === null) {
    matches = string.split(" ").slice(0, 20).join(" ");
    if (string !== matches) {
      matches += "...";
    }
  } else {
    matches = matches
      .map(
        (x) =>
          " ..." +
          x.replace(boldMatchStringRegex, `<b>${searchKey}</b>`) +
          "... "
      )
      .join("");
  }
  return matches;
}

// get all folders in database
exports.getAllFolders = (req, res) => {
  db.collection(`${production}folders`)
    .orderBy("lastModified", "desc")
    .get()
    .then((data) => {
      let folders = [];
      data.forEach((doc) => {
        let folder = doc.data();
        folder.id = doc.id;
        folders.push(folder);
      });
      return res.json(folders);
    })
    .catch((err) => {
      returnFormattedHttpError(
        res,
        500,
        "Server failed to get all folders. Please try again.",
        err
      );
    });
};

// temporary search
exports.searchFolders = (req, res) => {
  let searchTerm;
  try {
    searchTerm = `${req.params.searchTerm}`;
  } catch (err) {
    returnFormattedHttpError(
      res,
      400,
      "Invalid search term. Please try another search term.",
      err
    );
  }
  const folderPathsMapRef = db.collection(`${production}paths`).doc("folders");
  // global case insensitive matching
  var regex = new RegExp(searchTerm, "gi");
  db.collection(`${production}folders`)
    .orderBy("lastModified", "desc")
    .get()
    .then((allFolders) => {
      let matchedFolders = [];
      folderPathsMapRef
        .get()
        .then((folderPathsMapRes) => {
          const folderPathsMap = folderPathsMapRes.data();
          allFolders.forEach((doc) => {
            let folder = doc.data();
            folder.id = doc.id;

            let relevanceCount = 0;
            let titleMatchesArray = folder.title.match(regex);
            let contentMatchesArray = folder.content.match(regex);
            folder.content = boldFolderContentSearchMatches(
              folder.content,
              searchTerm
            );
            if (titleMatchesArray !== null) {
              relevanceCount += 2 * titleMatchesArray.length;
            }
            if (contentMatchesArray !== null) {
              relevanceCount += contentMatchesArray.length;
            }

            if (relevanceCount !== 0) {
              folder.relevanceCount = relevanceCount;
              folder.path = getFolderPath(folderPathsMap, folder.id);
              matchedFolders.push(folder);
            }
          });
        })
        .then((x) => {
          matchedFolders.sort((a, b) =>
            a.relevanceCount < b.relevanceCount
              ? 1
              : b.relevanceCount < a.relevanceCount
              ? -1
              : 0
          );
          return res.json(matchedFolders);
        });
    })
    .catch((err) => {
      returnFormattedHttpError(
        res,
        500,
        "Server failed to search. Please try again.",
        err
      );
    });
};

// get single folder
exports.getFolder = (req, res) => {
  let folderData = {};
  db.doc(`/${production}folders/${req.params.folderId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        returnFormattedHttpError(
          res,
          404,
          "Folder doesn't exist. Go back to Resources"
        );
      }
      folderData = doc.data();
      folderData.id = doc.id;
      // maybe increment folder contents
      if (typeof req.query.i === "string") {
        db.doc(`/${production}folders/${req.params.folderId}`).update({
          visits: admin.firestore.FieldValue.increment(1),
        });
      }
      // get all folder contents
      return db
        .collection(`${production}folders`)
        .orderBy("lastModified", "desc")
        .where("parent", "==", folderData.id)
        .get();
    })
    .then((folderContents) => {
      // add folder contents to folder object
      folderData.subfolders = [];
      folderContents.forEach((content) => {
        let subfolder = content.data();
        subfolder.id = content.id;
        folderData.subfolders.push(subfolder);
      });
      return db.doc(`/${production}paths/folders`).get();
    })
    .then((doc) => {
      // recursively construct folder path map
      if (!doc.exists) {
        returnFormattedHttpError(
          res,
          500,
          "Folder not found in folder path tree."
        );
      }
      const folderPathsMap = doc.data();
      folderData.path = getFolderPath(folderPathsMap, folderData.id);
      return res.json(folderData);
    })
    .catch((err) => {
      returnFormattedHttpError(
        res,
        500,
        "Server failed to get folder details. Please try again.",
        err
      );
    });
};

// create folder
exports.createFolder = (req, res) => {
  validateUserIsAdmin(req, res);
  req = formatReqBody(req);
  // move request params to JS object
  let parentFolderId;
  let folderTitle;
  try {
    parentFolderId = req.params.folderId;
    folderTitle = req.body.title;
  } catch (err) {
    returnFormattedHttpError(
      res,
      400,
      `Cannot create folder. Make sure the parent folder id in the request URL is correct and the 
      body contains the field title`,
      err
    );
  }

  const newFolder = {
    parent: parentFolderId,
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    title: folderTitle,
    content: "",
    defaultSubfolderSort: "alphabetical",
    index: 0,
    visits: 0,
  };

  // add newFolder to FB database
  db.collection(`${production}folders`)
    .add(newFolder)
    .then((doc) => {
      newFolder.id = doc.id;

      // update paths map
      return db.doc(`/${production}paths/folders`).get();
    })
    .then((doc) => {
      if (!doc.exists) {
        return res.status(500).json({ error: "Folder not found" });
      }
      const newFolderPathsMap = doc.data();
      const newFolderPathContents = {};
      newFolderPathContents.parentId = parentFolderId;
      newFolderPathContents.name = folderTitle;
      newFolderPathsMap[newFolder.id] = newFolderPathContents;
      db.doc(`/${production}paths/folders`).update(newFolderPathsMap);

      newFolder.path = getFolderPath(newFolderPathsMap, newFolder.id);
      res.json(newFolder);
    })
    .catch((err) => {
      returnFormattedHttpError(
        res,
        500,
        "Failed to create folder. Please try again.",
        err
      );
    });
};

exports.deleteFolder = (req, res) => {
  validateUserIsAdmin(req, res);
  const batch = db.batch();
  const folderRef = db.doc(`/${production}folders/${req.params.folderId}`);
  const folderPathsMapRef = db.collection(`${production}paths`).doc("folders");
  folderRef
    .get()
    .then((doc) => {
      if (!doc.exists) {
        returnFormattedHttpError(
          res,
          404,
          "Folder doesn't exist. Check the request URL"
        );
      }
      batch.delete(folderRef);
      batch.update(folderPathsMapRef, { [doc.id]: FieldValue.delete() });
      return batch.commit();
    })
    .then(() => {
      res.json({ message: "Folder deleted successfully" });
    })
    .catch((err) => {
      returnFormattedHttpError(
        res,
        404,
        "Failed to delete folder. Please try again.",
        err
      );
    });
};

exports.updateOneFolder = (req, res) => {
  req = formatReqBody(req);
  validateUserIsAdmin(req, res);

  if (Object.keys(req.body).length > 0) {
    try {
      const folderToUpdate = req.params.folderId;
      const updatedFolderContents = {
        ...req.body,
        lastModified: new Date().toISOString(),
      };
      var updatedFolderPathObj = {};
      if (
        typeof req.body.parent === "string" ||
        typeof req.body.parent === "number"
      ) {
        updatedFolderPathObj.parentId = req.body.parent;
      }
      if (
        typeof req.body.title === "string" ||
        typeof req.body.title === "number"
      ) {
        updatedFolderPathObj.name = req.body.title;
      }
      const folderRef = db.doc(`/${production}folders/${folderToUpdate}`);
      const folderPathsMapRef = db
        .collection(`${production}paths`)
        .doc("folders");
      const batch = db.batch();
      batch.update(folderRef, updatedFolderContents);
      if (
        typeof req.body.parent === "string" ||
        typeof req.body.parent === "number"
      ) {
        batch.update(folderPathsMapRef, {
          [`${folderToUpdate}.parentId`]: req.body.parent,
        });
      }
      if (
        typeof req.body.title === "string" ||
        typeof req.body.title === "number"
      ) {
        batch.update(folderPathsMapRef, {
          [`${folderToUpdate}.name`]: req.body.title,
        });
      }
      return batch.commit().then(() => {
        return res.json({ message: "Folder updated successfully." });
      });
    } catch (err) {
      returnFormattedHttpError(
        res,
        500,
        "Failed to update folder. Please try again",
        err
      );
    }
  } else {
    return res.json({ message: "No changes were made." });
  }
};
