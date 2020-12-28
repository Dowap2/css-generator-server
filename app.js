var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var app = express();
var cors = require("cors");

mongoose
  .connect("mongodb://127.0.0.1:27017/box", { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to Database");
  })
  .catch(err => {
    console.log("Not Connected to Database ERROR! ", err);
  });
var db = mongoose.connection;

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

var boxSchema = mongoose.Schema(
  {
    name: { type: String },
    state: { type: Object }
  },
  { versionKey: false }
);

var BoxState = mongoose.model("state", boxSchema);

app.get("/api", function(req, res) {
  BoxState.find({}, function(err, box) {
    if (err) {
      return res.json(err);
    }
    res.send({ box });
  });
});

app.post("/api", function(req, res) {
  BoxState.create({ state: req.body }),
    function(err) {
      if (err) console.log(err);
    };
  console.log(req.body.state.boWidth);
  let state = req.body.state;
  let boxState = new BoxState({
    state: state
  });
  boxState.save();
});

var port = 8000;

app.listen(port, function() {
  console.log("server on! http://localhost:" + port);
});
