const express = require("express");
const routes = require("./controllers");
const sequelize = require("./config/connection");
const { User, Comment, Podcast, Genre } = require("./models");
const helpers = require("./utils/helpers");

const path = require("path");
const exphbs = require("express-handlebars");
const hbs = exphbs.create({ helpers });

require("dotenv").config();
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, "./public")));
console.log(__dirname);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(session(sess));
app.use(routes);

// connection to db and server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});
