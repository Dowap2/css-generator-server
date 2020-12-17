var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var app = express();
var cors = require("cors");

mongoose.connect("mongodb://localhost/box", { useNewUrlParser: true });
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

var boxSchema = mongoose.Schema({
  boxWidth: { type: Number },
  boxHeight: { type: Number },
  borderWidth: { type: Number },
  borderStyle: { type: String },
  borderColor: { type: String },
  colorType: { type: String },
  boxColor: { type: String },
  color1: { type: String },
  color2: { type: String },
  gradientStyle: { type: String },
  deg: { type: Number },
  transformX: { type: Number },
  transformY: { type: Number },
  rotateX: { type: Number },
  rotateY: { type: Number },
  rotateZ: { type: Number },
  text: { type: String },
  textColor: { type: String },
  textStyle: { type: String },
  fontSize: { type: Number }
});

var Box = mongoose.model("box", boxSchema);

app.get("/api", function(req, res) {
  Box.find({}, function(err, box) {
    if (err) {
      return res.json(err);
    }
    console.log(1);
    res.send({ box: box });
  });
});

app.post("/api", function(req, res) {
  Box.create(req.body, function(err) {
    if (err) {
      return console.log(err);
    } else {
      console.log(req.body);
    }
  });
});

// app.delete("/api", function(req, res) {
//   Contact.deleteOne({ _id: req.body.id }, function(err) {
//     if (err) {
//       return console.log("error");
//     } else {
//       console.log(req);
//     }
//   });
// });

var port = 8000;

app.listen(port, function() {
  console.log("server on! http://localhost:" + port);
});
