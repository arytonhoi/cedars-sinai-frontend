const SMTPConnection = require("nodemailer/lib/smtp-connection");

const { fixFormat } = require("../util/util");
const { emailAuth, emailOptions } = require("../util/config.js");
const { isEmail } = require("../util/validators.js");

// Send an email 
exports.sendEmail = (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Only admins can send emails." });
  } else if (req.method !== "POST") {
    return res.status(400).json({ error: "Method not allowed" });
  }
  try {
    req = fixFormat(req);
  } catch (e) {
    return res.status(400).json({ error: "Invalid JSON." });
  }
  if(typeof(req.body.to)!=='string'){return res.status(400).json({ error: "Need to specify a recipient in to field." })}
  if(!isEmail(req.body.to)){return res.status(400).json({ error: "Invalid email in to field" })}
  if(typeof(req.body.toName)==='undefined'){req.body.toName = req.body.to.split("@")[0]}
  if(req.body.isHTML===true){req.body.isHTML = "text/html"}else{req.body.isHTML = "text/plain"}
  if(typeof(req.body.title)==='undefined'){return res.status(400).json({ error: "Need to specify a title" })}
  if(typeof(req.body.body)==='undefined'){return res.status(400).json({ error: "Need to specify a message body" })}
  let connection = new SMTPConnection(emailOptions);
  const message = 
`From: Service Account <cedars.sinai.service@gmail.com>
To: ${req.body.toName} <${req.body.to}>
Content-Type: ${req.body.isHTML}; charset=utf-8
MIME-Version: 1.0
Subject: ${req.body.title}

${req.body.body}`

  var headers = {
    from: "cedars.sinai.service@gmail.com",
    to: req.body.to,
    use8BitMime: true
  }
  connection.connect( x=>{
    if(x){console.log("x",x)}
    connection.login( emailAuth, y =>{
      if(y){console.log("y",y)}
      connection.send( headers, message, (err,info) =>{
        if(err){res.status(400).json(err)}
        if(info){res.json(info)}
      })
    })
  })

}

