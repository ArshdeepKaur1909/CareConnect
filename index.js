const express = require("express");
const mysql = require("mysql2");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

app.use(express.urlencoded(({extended: true})));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// REQUEST SETTING UP FOR WEBSITE LOADING
app.get("/careConnect", (req, res) => {
  res.render("careConnect.ejs");
});
// REQUEST FOR GIVING FORM FOR REGISTERING
app.get("/register", (req, res) => {
  res.render("register.ejs");
});
// REQUEST FOR DISPLAYING PATIENT DASHBOARD AFTER USER SELECTED PATIENT OPTION IN REGISTER FORM
app.post("/patient", (req, res) => {
  let {Email: email, Username: username, Password: password, Category} = req.body;
  let q = `SELECT count(username) FROM Patient`;
    connection.query(q, (err, result) => {
      if(err) throw err;
      let id = result[0]["count(username)"];
      let q = `INSERT INTO Patient (id, email, username, password) VALUES (${id}, "${email}", "${username}", "${password}")`;
    try{
      connection.query(q, (err, result) => {
        if(err) throw err;
        res.render("patient.ejs");
      })
    }catch(err){
        console.log(`Error Found: ${err}`);
    }
    });
});
// REQUEST FOR DISPLAYING DOCTOR DASHBOARD AFTER USER SELECTED DOCTOR OPTION IN REGISTER FORM
app.post("/doctor", (req, res) => {
  let q = `SELECT count(username) FROM Doctor`;
    connection.query(q, (err, result) => {
      if(err) throw err;
      let id = result[0]["count(username)"];
      let q = `INSERT INTO Doctor (id, email, username, password) VALUES (${id}, "${email}", "${username}", "${password}")`;
    try{
      connection.query(q, (err, result) => {
        if(err) throw err;
        res.render("doctor.ejs");
      })
    }catch(err){
        console.log(`Error Found: ${err}`);
    }
    });
});
// REQUEST FOR BOOKING CONSULTATION ON PATIENT DASHBOARD
app.post("/consultation", (req, res) => {
  let q = "SELECT username FROM Doctor";
  try{
    connection.query(q, (err, result) =>{
      if(err) throw err;
      let doctors = [];
      for(let i = 0; i<result.length; i++){
         doctors.push(result[i]["username"]);
      }
      res.render("consultation.ejs", {doctors});
    });
  }catch(err){
    console.log(`Error Occured: ${err}`);
  }
});
// REQUEST FOR REDIRECTING TO PATIENT DASHBOARD AFTER BOOKING CONSULTATION
app.patch("/booked", (req, res) => {
  res.redirect("/patient");
});
app.listen(8080, () => {
    console.log(`Listening Started At 8080`);
});
// SETTING UP THE CONNECTION BETWEEN DATABASE AND INDEX.JS
const connection = mysql.createConnection({
  host: 'localhost', 
  user:'root', 
  database: 'CareConnect', 
  password: 'Arshbanwait2@'
});