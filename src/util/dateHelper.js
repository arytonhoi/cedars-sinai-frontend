export class DateHelper{
  constructor(when){
    if(typeof(when) === "undefined"){
      this.date = new Date()
    }else{
      this.date = new Date(when)
    }
  }
  getTimestamp(){
    return this.date.getTime()
  }
  toString(dateString){
    if(typeof(dateString) === "undefined"){
      dateString = "dd MMMM YYYY"
    }
    var pos = 0
    var i=0
    var tokens=[]
    var resultString=""
    var dateTokens = [
      ["SECONDS",/^s{1,2}/g],
      ["MINUTE",/^m{1,2}/g],
      ["HOUR_12",/^H{1,2}/g],
      ["HOUR_24",/^h{1,2}/g],
      ["AMPM",/^t/g],
      ["DAY",/^d{1,4}/g],
      ["MONTH",/^M{1,4}/g],
      ["YEAR",/^[Yy]{1,4}/g],
      ["DEFAULT",/^[^=smHhdMtyY]+/g],
    ]
    while(dateString.length > 0){
      for(i=0;i<dateTokens.length;i++){
        var res = dateTokens[i][1].exec(dateString)
        dateString = dateString.slice(dateTokens[i][1].lastIndex)
        if(res!==null){
          tokens.push([dateTokens[i][0],res[0],res[0].length])
        }
      }
    }
    for(i=0;i<tokens.length;i++){
      var add = ""
      switch(tokens[i][0]){
        case "SECONDS":
          add = this.date.getSeconds()
          break;
        case "MINUTES":
          add = this.date.getMinutes()
          break;
        case "HOUR_12":
          add = this.date.getHours()
          break;
        case "HOUR_24":
          add = this.date.getHours()%12
          break;
        case "AMPM":
          add = (this.date.getHours()>12) ? "AM" : "PM"
          break;
        case "DAY":
          add = this.date.getDate()
          break;
        case "MONTH":
          add = this.date.getMonth()
          if(tokens[i][2] === 3){
            add = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][add]
          }else if(tokens[i][2] === 4){
            add = ["January","February","March","April","May","June","July","August","September","October","November","December"][add]
          }
          break;
        case "YEAR":
          add = this.date.getFullYear().toString()
          add = parseInt(add.slice(add.length-tokens[i][2]))
          break;
        default:
          add = tokens[i][1].toString()
      }
      if(typeof(add)=="number"){
        var delta = add.toString().length - tokens[i][2] + 1
        add = (Array(Math.max(delta,0)).join("0") + add)
      }
      resultString += add
    }
    return resultString
  }

}

export default DateHelper
