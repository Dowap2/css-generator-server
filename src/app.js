var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var app = express();
var cors = require("cors");
var db = mongoose.connection;

mongoose
  .connect("mongodb://127.0.0.1:27017/box", { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to Database");
  })
  .catch(err => {
    console.log("Not Connected to Database ERROR! ", err);
  });

db.once("open", function() {
  console.log("DB connected");
});

db.on("error", function(err) {
  console.log("DB ERROR : ", err);
});

app.use(cors());
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let boxSchema = mongoose.Schema(
  {
    name: { type: String },
    state: { type: Object }
  },
  { versionKey: false }
);

let userSchema = mongoose.Schema({
  id: { type: String },
  pw: { type: String },
  name: { type: String }
});

let BoxState = mongoose.model("state", boxSchema);
let UserState = mongoose.model("user", userSchema);

app.get("/api/box", function(req, res) {
  BoxState.find({}, function(err, box) {
    if (err) {
      return res.json(err);
    }
    res.send({ box });
  });
});

app.post("/api/box", function(req, res) {
  BoxState.create({ state: req.body }),
    function(err) {
      if (err) console.log(err);
    };
  const state = req.body.state;
  const name = req.body.name;
  const boxState = new BoxState({ name: name }, state);
  boxState.save();
});

app.post("/api/signin", function(req, res) {
  console.log(req.body);
  UserState.find({ id: req.body.id, pw: req.body.pw }, function(err, user) {
    if (err) {
      console.log(err);
    } else {
      console.log(user);
      res.send(user);
    }
  });
});

app.post("/api/signup", function(req) {
  console.log(req.body);
  UserState.create(
    { id: req.body.id, pw: req.body.pw, name: req.body.name },
    function(err) {
      if (err) {
        console.log(err);
      }
      const id = req.body.id;
      const pw = req.body.pw;
      const name = req.body.name;
      const userInfo = new UserState({ id: id, pw: pw, name: name });
      userInfo.save();
    }
  );
});

var port = 8000;

app.listen(port, function() {
  console.log("server on! http://localhost:" + port);
});
