const express = require('express');
const app = express();
const login_signup = require('./src/routes/authRoutes');
const books = require('./src/routes/booksRoutes');
const authors = require('./src/routes/authorsRoutes');
const publishers = require('./src/routes/publishersRoutes');
const genres = require('./src/routes/genresRoutes');
const users = require('./src/routes/userRoutes');
const passport = require('passport');
require('./src/passport-config');
const port = process.env.PORT || 3000;


// MiddleWares
app.use(passport.initialize());
app.use(express.json());

// Routes
app.use('/', login_signup);
app.use('/', passport.authenticate('jwt', { session: false }), books);
app.use('/', passport.authenticate('jwt', { session: false }), authors);
app.use('/', passport.authenticate('jwt', { session: false }), publishers);
app.use('/', passport.authenticate('jwt', { session: false }), genres);
// app.use('/', passport.authenticate('jwt', { session: false }), users);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
