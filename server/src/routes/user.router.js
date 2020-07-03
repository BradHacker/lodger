const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt-nodejs');

const { User } = require('../models/user.model');

const userRouter = express.Router();

// userRouter.get('/', (req, res) => {
//   User.find({}, (err, result) => {
//     if (err) res.status(400).send({ success: false, error: err.message });

//     res.status(200).send({ success: true, data: result });
//   });
// });

userRouter.get('/me', (req, res) => {
  if (req.user) {
    const user = { ...req.user._doc };
    delete user.password;
    return res.status(200).send(user);
  }
  return res.status(401).send({});
});

// userRouter.get('/:user_id', (req, res) => {
//   User.findById(req.params.user_id, { password: 0 }, (err, result) => {
//     if (err) res.status(400).send({ success: false, error: err.message });

//     res.status(200).send({ success: true, data: result });
//   });
// });

userRouter.post('/register', (req, res) => {
  User.create(
    { username: req.body.username, name: req.body.name, password: bcrypt.hashSync(req.body.password) },
    (err, user) => {
      if (err) return res.status(400).send({ success: false, error: { ...err } });
      return res.status(201).send({ success: true, user });
    }
  );
});

userRouter.post('/login', passport.authenticate('local'), (req, res) => {
  if (req.user) return res.json(req.user);
  return res.status(503).send({ message: 'Not Found' });
});

userRouter.get('/logout', (req, res) => {
  req.logout();
  return res.status(204).send();
});

module.exports = { userRouter };
