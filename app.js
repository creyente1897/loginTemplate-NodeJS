const express = require('express');
const app = express();
const passport = require('passport');
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');

// Require Passport
require('./config/passport')(passport);

//DB
const db = require('./config/keys').MongoURI;

//Mongoose Connect
mongoose.connect(db, { useNewUrlParser: true })
.then(() => {
    console.log('MongoDB Connected');
})
.catch((err) => {
    console.log(err);
});

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Bodyparser
app.use(express.urlencoded({ extended:false }));

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
}); 