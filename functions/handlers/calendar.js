var {google} = require('googleapis');
const { formatReqBody } = require("../util/util");
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
// Some of these endpoints will probably never be used, but are kept here in case they cannot be managed through Google's frontend
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
    req = formatReqBody(req);
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
    if (typeof(req.query.start) === "undefined") {
      req.query.start = Date.parse(new Date())
    }

    if ( isNaN(Date.parse(req.query.start)) ) {
      if( isNaN(parseInt(req.query.start)) ){
        req.query.start = (new Date()).toISOString()
      }else{
        req.query.start = parseInt(req.query.start)
      }
    }else{
      req.query.start = Date.parse(req.query.start)
    }

    if ( isNaN(Date.parse(req.query.end)) ) {
      if( isNaN(parseInt(req.query.end)) ){
        if ( isNaN(parseInt(req.query.duration)) ) {
          req.query.end = parseInt(req.query.start) + 2678400000
        }
        else {
          req.query.end = parseInt(req.query.start) + parseInt(req.query.duration)
        }
      }else{
        req.query.end = parseInt(req.query.end)
      }
    }else{
      req.query.end = Date.parse(req.query.end)
    }
    api.events.list({
      calendarId : req.params.calendarId,
      timeMin: (new Date(req.query.start)).toISOString(),
      timeMax: (new Date(req.query.end)).toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    }).then( cal =>{
      //console.log(cal);
      res.json(cal.data);
    }).catch(err =>
      res.status(400).json({'error':err.response})
    )
  }
}

//Creates a calendar  
exports.createCalendar = (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Only admins can create calendars." });
  }
  try {
    req = formatReqBody(req);
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
  
//Creates an event  
exports.createCalendarEvent = (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Only admins can create events." });
  }
  if (req.params.calendarId === "" || req.params.calendarId === undefined) {
    return res.status(400).json({ error: "Must specify calendar to add event to." });
  }
  try {
    req = formatReqBody(req);
  } catch (e) {
    return res.status(400).json({ error: "Invalid JSON." });
  }
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Method not allowed" });
  }
  if(typeof(req.body.start) !== 'object' || (!isNaN(Date.parse(req.body.start.date)) && !isNaN(Date.parse(req.body.start.dateTime))) ){
    return res.status(400).json({ error: "Need to provide start time." });
  }
  if(typeof(req.body.end) !== 'object' || (!isNaN(Date.parse(req.body.end.date)) && !isNaN(Date.parse(req.body.end.dateTime))) ){
    req.body.end = {
      dateTime : (new Date(Date.parse(req.body.start.dateTime)+3600000)).toISOString()
    }
  }
  if(typeof(req.body.title) !== "undefined" || req.body.title !== "" ){
    req.body.summary = req.body.title
    api.events.insert(
      {
        calendarId: req.params.calendarId,
        requestBody : req.body
      }
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
    req = formatReqBody(req);
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

// Updates a calendar event  
exports.editCalendarEvent = (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Only admins can edit calendar events." });
  }
  try {
    req = formatReqBody(req);
  } catch (e) {
    return res.status(400).json({ error: "Invalid JSON." });
  }
  if (req.method !== "PATCH") {
    return res.status(400).json({ error: "Method not allowed" });
  }
  if(typeof(req.body.start) !== 'object' || (!isNaN(Date.parse(req.body.start.date)) && !isNaN(Date.parse(req.body.start.dateTime))) ){
    return res.status(400).json({ error: "Need to provide new start time." });
  }
  if(typeof(req.body.end) !== 'object' || (!isNaN(Date.parse(req.body.end.date)) && !isNaN(Date.parse(req.body.end.dateTime))) ){
    req.body.end = {
      dateTime : (new Date(Date.parse(req.body.start.dateTime)+3600000)).toISOString()
    }
  }
  api.events
    .update({
      calendarId : req.params.calendarId, 
      eventId : req.params.eventId, 
      requestBody : req.body 
    })
    .then(
      cal => res.json({"message":`Successfully updated ${req.params.eventId}`})
    )
    .catch(err => 
      {
        try{
          res.status(err.response.status).json(
            {'error':err.response.data.error,'general':`Cannot update ${req.params.eventId}`}
          )
        }catch(e){
          res.status(500).json(
            {'general':`Cannot update ${req.params.eventId}. Server did not provide error mesage.`}
          )
        }
      }
    )
}

// Deletes a calendar event
exports.deleteCalendarEvent = (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Only admins can delete events." });
  }
  if (req.params.calendarId === "" || req.params.calendarId === undefined) {
    return res.status(400).json({ error: "Must specify calendar to delete event from." });
  }
  if (req.params.eventId === "" || req.params.eventId === undefined) {
    return res.status(400).json({ error: "Must specify event to delete." });
  }
  if (req.method !== "DELETE") {
    return res.status(400).json({ error: "Method not allowed" });
  }
  api.events.delete({
    calendarId : req.params.calendarId,
    eventId : req.params.eventId
  }).then(
    cal => res.json({"message":`Successfully deleted ${req.params.eventId}`})
  ).catch(
    err => {
      try{
        res.status(err.response.status).json(
          {'error':err.response.data.error,'general':`Cannot delete ${req.params.eventId}`}
        )
      }catch(e){
        res.status(500).json(
          {'general':`Cannot delete ${req.params.eventId}. Server did not provide error mesage.`}
        )
      }
    }
  )
}

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
