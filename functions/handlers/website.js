const https = require('https');

exports.fetchWhois = (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Only admins can send emails." });
  } else if (req.method !== "GET") {
    return res.status(400).json({ error: "Method not allowed" });
  }
  if(typeof(req.params.domain)==='undefined' || req.params.domain.length === 0){
    var url = "cedarsoreducation.com"
  }else{
    var url = req.params.domain
  }
  url=url.replace(/^\w+?:\/\//,"").split(".")
  https.get(`https://webwhois.verisign.com/webwhois-ui/rest/whois?tld=${url.pop()}&q=${url.pop()}&type=domain`,
    (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });
      resp.on('end', () => {
        message = JSON.parse(data)
        message.whois = {}
        message.message.match(/^No match for domain/) === null?
        message
          .message.slice(0,/>>> Last update of +/.exec(message.message).index)
          .split(/\n?   /)
          .forEach(x=>{if(x!==""){x=x.split(": ");message.whois[x[0]]=x[1]}}) :
        message.whois = {"error":"Domain not found"}
        res.json(message);
      });
    }).on("error", (err) => {
      res.status(err.status).json({"Error": err.message});
    });
  }

