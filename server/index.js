const path = require('path');

const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcrypt-nodejs');

const { User } = require('./src/models/user.model');
const { userRouter } = require('./src/routes/user.router');
const { hotelRouter } = require('./src/routes/hotel.router');

const app = express();
const PORT = 8080;
const CLIENT_BUILD_PATH = path.join(__dirname, '../client/build');

require('./src/database');

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false, { message: 'Incorrect Username.' });
      if (!bcrypt.compareSync(password, user.password)) return done(null, false, { message: 'Incorrect password.' });
      return done(null, user);
    });
  })
);
passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

app.use(cors());
app.use(session({ secret: process.env.SESSION_SECRET }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(CLIENT_BUILD_PATH));

  app.get('/', (req, res) => {
    res.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'));
  });
}

app.use('/api/v1/users', userRouter);
app.use('/api/v1/hotels', hotelRouter);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`); // eslint-disable-line no-console
});
