var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var app = express();
var cors = require("cors");

mongoose
  .connect(
    "mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb",
    { useNewUrlParser: true }
  )
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
  fontSize: { type: Number },
  versionKey: false
});

var Box = mongoose.model("box", boxSchema);

app.get("/api", function(req, res) {
  Box.find({}, function(err, box) {
    if (err) {
      return res.json(err);
    }
    res.send({ box });
  });
});

app.post("/api", function(req, res) {
  Box.create({ state: req.body }),
    function(err) {
      if (err) console.log(err);
    };
});

var port = 8000;

app.listen(port, function() {
  console.log("server on! http://localhost:" + port);
});
