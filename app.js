var createError = require("http-errors");
const cookieSession = require("cookie-session");
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
console.log(process.env.MONGODB_CONNECT);
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
// app.use(
//   cookieSession({
//     name: "session",
//     keys: [process.env.COOKIE_SECRET],
//     maxAge: 24 * 60 * 60 * 100
//   })
// );

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

var passport = require("../backend/config/passport")(app);
const index = require("./routes/index");
const login = require("./routes/login")(passport);
const logout = require("./routes/logout");
const register = require("./routes/register");
const upload = require("./routes/upload");
const onload = require("./routes/onload");
const search = require("./routes/search");

app.use("/", index);
app.use("/login", login);
app.use("/logout", logout);
app.use("/register", register);
app.use("/upload", upload);
app.use("/onload", onload);
app.use("/search", search);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
