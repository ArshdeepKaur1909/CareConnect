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
  let {Email: email, Username: username, Password: password} = req.body;
  let b = `SELECT * FROM Patient WHERE username = ?`;
  connection.query(b, [username], (err, result) => {
    if(err) throw err;
    if(result.length > 0){
      res.render("patient.ejs");
    }else{
      let q = `SELECT count(username) FROM Patient`;
    connection.query(q, (err, result) => {
      if(err) throw err;
      let id = result[0]["count(username)"];
      let p = `INSERT INTO Patient (id, email, username, password) VALUES (${id}, "${email}", "${username}", "${password}")`;
    try{
      connection.query(p, (err, result) => {
        if(err) throw err;
        res.render("patient.ejs");
      })
    }catch(err){
        console.log(`Error Found: ${err}`);
    }
    });
    }
  });
});
// REQUEST FOR DISPLAYING DOCTOR DASHBOARD AFTER USER SELECTED DOCTOR OPTION IN REGISTER FORM
app.post("/doctor", (req, res) => {
  let {Email: email, Username: username, Password: password} = req.body;
  let b = `SELECT * FROM Doctor WHERE username = ?`;
  connection.query(b, [username], (err, result) => {
    if(err) throw err;
    if(result.length > 0){
      let c = `SELECT id FROM Doctor WHERE username = "${username}"`;
      connection.query(c, (err, result) => {
        if(err) throw err;
        let id = result[0]["id"];
        res.render("doctor.ejs", {id});
      });
    }else{
      let q = `SELECT count(username) FROM Doctor`;
    connection.query(q, (err, result) => {
      if(err) throw err;
      let id = result[0]["count(username)"];
      let p = `INSERT INTO Doctor (id, email, username, password) VALUES (${id}, "${email}", "${username}", "${password}")`;
    try{
      connection.query(p, (err, result) => {
        if(err) throw err;
        res.render("doctor.ejs", {id});
      })
    }catch(err){
        console.log(`Error Found: ${err}`);
    }
    });
    }
  });
});
// REQUEST FOR ADDING ADDITIONAL INFORMATION OF DOCTOR TO DOCTOR DATABASE
app.post("/addInfo/:id", (req, res) => {
 let {id: Id} = req.params;
 let {Speciality: speciality, Experience: experience, Fees: fees, Consult: consult} = req.body;
 let q = `UPDATE doctor SET speciality = "${speciality}", experience = ${experience}, Fees = ${fees}, Consult = "${consult}" WHERE id = ${Id}`;
 connection.query(q, (err, result) => {
   if (err) throw err;
 });
});
// REQUEST FOR BOOKING CONSULTATION ON PATIENT DASHBOARD
app.get("/consultation", (req, res) => {
   let { Consult, experience, fees } = req.query;

  // Normalize to arrays
  Consult = [].concat(Consult || []);
  experience = [].concat(experience || []);
  fees = [].concat(fees || []);

  let conditions = [];

  // Consult filter
  if (Consult.length > 0) {
    const consultValues = Consult.map(c => connection.escape(c)).join(",");
    conditions.push(`consult IN (${consultValues})`);
  }

  // Experience filter
  if (experience.length > 0) {
    const expConditions = experience.map(range => {
      if (range === "0-5") return `(experience BETWEEN 0 AND 5)`;
      if (range === "6-10") return `(experience BETWEEN 6 AND 10)`;
      if (range === "11-16") return `(experience BETWEEN 11 AND 16)`;
      if (range === "16+") return `(experience > 16)`;
    }).filter(Boolean);
    conditions.push(`(${expConditions.join(" OR ")})`);
  }

  // Fees filter
  if (fees.length > 0) {
    const feesConditions = fees.map(range => {
      if (range === "100-500") return `(fees BETWEEN 100 AND 500)`;
      if (range === "500-1000") return `(fees BETWEEN 500 AND 1000)`;
      if (range === "1000+") return `(fees > 1000)`;
    }).filter(Boolean);
    conditions.push(`(${feesConditions.join(" OR ")})`);
  }

  let q = `SELECT * FROM Doctor`;
  if (conditions.length > 0) {
    q += ` WHERE ${conditions.join(" AND ")}`;
  }

  // Run query
  connection.query(q, (err, result) => {
    if (err) {
      console.error("Error while querying DB:", err);
      return res.status(500).send("Internal Server Error");
    }
    res.render("consultation.ejs", { result });
  });
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