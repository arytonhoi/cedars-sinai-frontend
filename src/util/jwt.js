//const crypto = require('crypto');

class JWT{
  constructor(token){
    token = token.toString()
    token = token.replace("Bearer ","").replace(/-/g,"+").replace(/_/g,"/").split(".")
    this.messageRaw = token[0] + "." + token[1]
    this.parse = {"header":JSON.parse(atob(token[0])),
                "payload":JSON.parse(atob(token[1])),
                "signature":token[2]
               }
  }
  verify(key){
    return 1;
  }
/*
  verify(key) {
    var hash = {"S256":"sha256","S384":"sha384","S512":"sha512"}
    try{hash = hash[this.parse.header.alg.toUpperCase().slice(1)]}catch(e){return -1}
    var ver = "HREP".indexOf(this.parse.header.alg[0])
    switch(ver){
      case 1:
        var check = crypto.createVerify(hash)
        check.write(this.messageRaw)
        check.end()
        //console.log(check.verify(key,this.parse.signature,"base64"))
        //doesn't accept x509 cert
        return 5;
        break;
      default:
        return -1;
        break;
    }
    //var mhash = crypto.createHash(["sha256","sha384","sha512"][hash]).update(this.messageRaw)
    //console.log(mhash)
//todo: get secret that kid references from https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com
    return 1
  }
*/
};

export default JWT

