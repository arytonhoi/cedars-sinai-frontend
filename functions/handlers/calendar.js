var {google} = require('googleapis');
const { fixFormat } = require("../util/shim");
const { serviceKey } = require("../util/config.js");
const SCOPES = 'https://www.googleapis.com/auth/calendar';

var auth = new google.auth.JWT(
  serviceKey.client_email,
  null,
  serviceKey.private_key,
  SCOPES,
  'fir-db-d2d47@appspot.gserviceaccount.com'
);

const api = google.calendar({version : "v3", auth : auth});
//Lists all calendars.
exports.getCalendarList = (req, res) => {
  if (req.method !== "GET") {
    return res.status(400).json({ error: "Method not allowed" });
  }
  api.calendarList.list().then( cal =>{
    console.log(cal);
    res.json(cal.data.items);
  }).catch( err =>
    {
      try{
        res.status(err.response.status).json(
          {'error':err.response.data.error,'general':`Cannot create ${req.params.calendarId}`}
        )
      }catch(e){
        res.status(500).json(
          {'general':`Cannot create ${req.params.calendarId}. Server did not provide error message.`}
        )
      }
    }
  )
}

//Change calendar permissions
exports.getCalendarAcl = (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Only admins can view calendar permissions." });
  }
  if (req.method !== "GET") {
    return res.status(400).json({ error: "Method not allowed" });
  }
  api.acl.list({calendarId : req.params.calendarId}).then( cal =>{
    console.log(cal);
    res.json(cal.data.items);
  }).catch( err =>
    {
      try{
        res.status(err.response.status).json(
          {'error':err.response.data.error,'general':`Cannot retrieve ACL list for ${req.params.calendarId}`}
        )
      }catch(e){
        res.status(500).json(
          {'general':`Cannot retrieve ACL list for ${req.params.calendarId}. Server did not provide error message.`}
        )
      }
    }
  )
}

exports.addCalendarAcl = (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Only admins can add calendar permissions." });
  }
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Method not allowed" });
  }
  try {
    req = fixFormat(req);
  } catch (e) {
    return res.status(400).json({ error: "Invalid JSON." });
  }
  api.acl.insert({
    calendarId : req.params.calendarId,
    requestBody : {
      scope: {type: "user", "value": req.body.user},
      role: req.body.role
    }
  }).then( cal =>{
    console.log(cal);
    res.json(cal.data);
  }).catch( err =>
    {
      try{
        res.status(err.response.status).json(
          {'error':err.response.data.error,'general':`Cannot create ACL rule for ${req.params.calendarId}`}
        )
      }catch(e){
        res.status(500).json(
          {'general':`Cannot create ACL rule for ${req.params.calendarId}. Server did not provide error message.`}
        )
      }
    }
  )
}

//Returns a calendar.
exports.getCalendar = (req, res) => {
  if (req.method !== "GET") {
    return res.status(400).json({ error: "Method not allowed" });
  }
  if(req.params.calendarId === ""){
    return res.status(400).json({ error: "Need to request a calendar ID" });
  }else{
    api.events.list({calendarId : req.params.calendarId}).then( cal =>{
      console.log(cal);
      res.json(cal.data);
    }).catch(err =>
      res.error({'error':err.response})
    )
  }
}

//Creates a calendar  
exports.createCalendar = (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Only admins can create calendars." });
  }
  try {
    req = fixFormat(req);
  } catch (e) {
    return res.status(400).json({ error: "Invalid JSON." });
  }
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Method not allowed" });
  }
  if(typeof(req.body.title) !== "undefined" && req.body.title !== "" ){
    api.calendars.insert(
      {requestBody : { summary : req.body.title}}
    ).then( cal =>{
      console.log(cal);
      res.json(cal.data);
    }).catch( err =>
      {
        try{
          res.status(err.response.status).json(
            {'error':err.response.data.error,'general':`Cannot create ${req.params.calendarId}`}
          )
        }catch(e){
          res.status(500).json(
            {'general':`Cannot create ${req.params.calendarId}. Server did not provide error message.`}
          )
        }
      }
    )
  }else{
    return res.status(400).json({ error: "Must supply a calendar title." });
  }
}
         
// Updates a calendar  
exports.editCalendar = (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Only admins can create calendars." });
  }
  try {
    req = fixFormat(req);
  } catch (e) {
    return res.status(400).json({ error: "Invalid JSON." });
  }
  if (req.method !== "PATCH") {
    return res.status(400).json({ error: "Method not allowed" });
  }
  api.calendars
    .update({
      calendarId : req.params.calendarId, 
      requestBody : req.body 
    })
    .then(
      cal => res.json({"message":`Successfully updated ${req.params.calendarId}`})
    )
    .catch(err => 
      {
        try{
          res.status(err.response.status).json(
            {'error':err.response.data.error,'general':`Cannot update ${req.params.calendarId}`}
          )
        }catch(e){
          res.status(500).json(
            {'general':`Cannot update ${req.params.calendarId}. Server did not provide error mesage.`}
          )
        }
      }
    )
}

// Deletes a calendar  
exports.deleteCalendar = (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Only admins can create calendars." });
  }
  if (req.params.calendarId === "" || req.params.calendarId === undefined) {
    return res.status(400).json({ error: "Must specify calendar to delete." });
  }
  if (req.method !== "DELETE") {
    return res.status(400).json({ error: "Method not allowed" });
  }
  api.calendars.delete({calendarId : req.params.calendarId}).then(
    cal => res.json({"message":`Successfully deleted ${req.params.calendarId}`})
  ).catch(
    err => {
      try{
        res.status(err.response.status).json(
          {'error':err.response.data.error,'general':`Cannot delete ${req.params.calendarId}`}
        )
      }catch(e){
        res.status(500).json(
          {'general':`Cannot delete ${req.params.calendarId}. Server did not provide error mesage.`}
        )
      }
    }
  )
}

