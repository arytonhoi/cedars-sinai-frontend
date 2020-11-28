const { admin, db } = require("../util/admin");

exports.getDBContents = (req, res) => {
  if (req.method !== "GET") {
    return res.status(400).json({ error: "Method not allowed" });
  }
  if(req.user.isAdmin){
    var database = {}
    db.listCollections().then( all =>
      Promise.all(
        all.map(col => 
          db.collection(col.id)
          .get()
          .then((doc) => {
            database[col.id] = []
            doc.forEach(x=>{database[col.id].push(x.data())})
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json({ error: `Error backing up ${col.id}` });
          })
        )
      ).then(x=>res.json(database))
    )
  }else{
    res.status(403).json({ error: "Backups may only be made by admins." });
  }
};
