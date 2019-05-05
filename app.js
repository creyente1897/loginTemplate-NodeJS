const express = require('express');
const app = express();
const PORT = process.env.port || 5000;
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');

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

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
}); 