// Database design
// https://firebase.google.com/docs/database/web/structure-data#avoid_nesting_data

exports.folderSchema = {
  parent: "",
  createdAt: "",
  lastModified: "",
  title: "",
  content: "",
  defaultSubfolderSort: "alphabetical",
  visits: 0,
};
