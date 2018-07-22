const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const mongoose = require('mongoose');

var cookieParser = require('cookie-parser');

const  config = {
    dbUrl : 'mongodb://kadaverin:1q2w3e@ds137530.mlab.com:37530/test-database'
}

const app = express();

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use( session({
    secret: 'asdfsdfqwerwerwe2EESDF2EDF45f',
    resave: false,
    saveUninitialized: false, 
    store: new (require("connect-mongo")(session))({
        url: config.dbUrl
    }) 
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'))

app.set('views', './views')
app.set('view engine', 'pug')

const apiRoutes = require("./routes/api/indexRoutes")(app);
const webRoutes = require("./routes/web/index")(app);

mongoose.connect(config.dbUrl);

app.listen(3000, () => {
    console.log('listening on 3000')
})