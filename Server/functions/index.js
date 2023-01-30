const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const app = express();

// Private database information so i add it to .gitignore
const data = require("./db");

// mysql database profile used to connect to the mysql database
const db = mysql.createPool({
  connectionLimit: data.connectionLimit,
  host: data.host,
  user: data.user,
  password: data.password,
  database: data.database,
});

// list of allowed IP addresses that can use this server
var whitelist = ["https://todo-list-node-886bf.firebaseapp.com"];
// checks for if the IP address is valid
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      console.log(origin);
      callback(null, true);
    } else {
      console.log(origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// middleware that converts the data to json
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// used for additional API calls like DELETE
app.options("*", cors());

// fetches the todos for a specific user from the database
app.get("/api/get/:user", cors(corsOptions), (req, res) => {
  const user = req.params.user;

  const sqlSelect = "SELECT * FROM todos WHERE user = ?";
  db.query(sqlSelect, user, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

// adds a todod to the database
app.post("/api/insert", cors(corsOptions), (req, res) => {
  const id = req.body.id;
  const user = req.body.user;
  const todo = req.body.todo;
  const isDone = req.body.isDone;
  const completed = req.body.completed;

  const sqlInsert =
    "INSERT INTO todos (id, user, todo, isDone, completed) VALUES (?, ?, ?, ?, ?)";
  db.query(sqlInsert, [id, user, todo, isDone, completed], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.sendStatus(200);
    }
  });
});

// updates a todo in the database
app.put("/api/update", cors(corsOptions), (req, res) => {
  const id = req.body.id;
  const todo = req.body.todo;
  const isDone = req.body.isDone;
  const completed = req.body.completed;

  const sqlUpdate =
    "UPDATE todos SET todo = ?, isDone = ?, completed = ? WHERE id = ?";
  db.query(sqlUpdate, [todo, isDone, completed, id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.sendStatus(200);
    }
  });
});

// deletes a todo from the database
app.delete("/api/delete/:id", cors(corsOptions), (req, res) => {
  const id = req.params.id;

  const sqlDelete = "DELETE FROM todos WHERE id = ?";
  db.query(sqlDelete, id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.sendStatus(200);
    }
  });
});

exports.app = functions
  .runWith({
    // Ensure the function has enough memory and time
    // to process large files
    timeoutSeconds: 3,
    memory: "128MB",
  })
  .https.onRequest(app);
