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
  url=url.replace(/^\w+?:\/\//,"").split("/")[0].split(/\.(?=[a-z]+$)/)
  https.get(`https://webwhois.verisign.com/webwhois-ui/rest/whois?tld=${url.pop()}&q=${url.pop()}&type=domain`,
    (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });
      resp.on('end', () => {
        try{
          message = JSON.parse(data)
        }catch(e){
          res.status(500).json({"status":"failure", 'message':'Response was invalid JSON.','data':data});
        }
        try{
          message.whois = {"status":"success"}
          message.message.match(/^No match for domain/) === null?
          message
            .message.slice(0,/>>> Last update of +/.exec(message.message).index)
            .split(/\n?   /)
            .forEach(x=>{
              if(x!==""){
                x=x.split(": ")
                typeof(message.whois[x[0]])==='undefined'?message.whois[x[0]]=[x[1]]:message.whois[x[0]].push(x[1])
              }
            }) :
          message.whois = {"status":"failure", "message":"Domain not found."};
          Object.keys(message.whois).forEach( x => 
            message.whois[x].length <= 1 && (message.whois[x] = message.whois[x][0])
          )
          res.json(message.whois);
        } catch(e){
          res.status(500).json({"status":"failure", 'message':'Whois data could not be parsed.', 'data':JSON.parse(data)});
        }
      });
    }).on("error", (err) => {
      res.status(err.status).json({"Error": err.message});
    });
  }

