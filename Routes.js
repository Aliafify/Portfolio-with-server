const express = require("express");
const Admin = require("./adminSchema.js");
const Account2 = require("./Account2Schema.js");
const Account3 = require("./account3Schema.js")
const bcrypt = require("bcryptjs");
const passport = require("passport");
const Router = express.Router();
const { fetchData,fetchUser,createElement, updatElement} = require("./mongoose.js");

Router.get("/clients", getClients);
async function getClients(req, res) {
  try {
    await fetchData((data) => res.send(data), Client);
  } catch (err) {
    console.error(err);
  }
}
//--- get admins accounts-----
Router.get("/admins", getAdmins);
async function getAdmins(req, res) {
  try {
    await fetchData((data) => res.send(data), Admin);
  } catch (err) {
    console.error(err);
  }
}
//fetchData(data=>console.log(data),Admin);

//---------Login------------------
Router.get("/auth", async (req, res) => {
  try {
    if (req.user) {
      const id = req.session.passport.user;
      const role = req.user.user.role;
      const schemas = { admin: Admin, teacher: Account2, student: Account3 };
      const Schema = schemas[role];
      await Schema.findOne({ _id: id }, (err, user) => {
        if (err) throw err;
        res.send({ user: user, auth: true });
      });
    } else {
      res.send({ user: null, auth: false });
    }
  } catch (e) {
    console.send(err);
  }
});
//-----
Router.post("/login", auth);
function auth(req, res, next) {
  try {
    passport.authenticate("local", (err, user, info) => {
      if (err) throw err;
      if (!user) res.send("No User Exists");
      else {
        req.logIn(user, (err) => {
          if (err) throw err;
          const User = user;
          User[auth] = true;
          res.send({ user: user, auth: true });
        });
      }
    })(req, res, next);
  } catch (err) {
    res.send(err);
  }
}
//----- Admin-------
Router.post("/register/admin", createAdmin);
function createAdmin(req, res) {
  try {
    Admin.findOne({ email: req.body.email }, async (err, doc) => {
      if (err) throw err;
      if (err) {
        res.send(err);
        console.log(err);
      }
      if (doc) res.send("exist");

      if (!doc) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new Admin({ ...req.body, password: hashedPassword });
        await newUser.save();
        res.status(200);
        res.send("created");
      }
    });
  } catch (err) {
    res.status(500).send(err);
  }
}

//update
Router.put("/update", update);
function update(req, res) {
  try {
    const property = req.body.property; // ??
    const type = req.body.type;
    const id = req.body.id;
    if (type === "admin") {
      updatElement({ _id: id }, property, Admin);
      res.send("done");
      res.status(200);
    } else if (type === "teacher") {
      updatElement({ _id: id }, property, Partener);
      res.send("done");
      res.status(200);
    } else if (type === "student") {
      updatElement({ _id: id }, property, Client);
      res.send("done");
      res.status(200);
    }
  } catch (err) {
    console.error(err);
  }
}

module.exports = Router;
