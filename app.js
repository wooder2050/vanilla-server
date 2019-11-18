var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var logger = require("morgan");
var session = require("express-session");
var FileStore = require("session-file-store")(session);
var methodOverride = require("method-override");
const cors = require("cors");

require("dotenv").config();
var connect = require("./models/index");

var app = express();

connect();
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
  })
);

const index = require("./routes/index");
var passport = require("./config/passport")(app);
const login = require("./routes/login")(passport);
const logout = require("./routes/logout");
const register = require("./routes/register");

const users = require("./routes/users");
const posts = require("./routes/posts");
const assets = require("./routes/assets");

app.use("/", index);
app.use("/login", login);
app.use("/logout", logout);
app.use("/register", register);

app.use("/users", users);
app.use("/posts", posts);
app.use("/assets", assets);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
