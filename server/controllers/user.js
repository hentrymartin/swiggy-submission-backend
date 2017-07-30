const mongoose = require('mongoose');
const userModel = require('./../models').user;
const moment = require('moment');
const jwt = require('jsonwebtoken');
const config = require('./../config/config.js');

module.exports = {
  create(req, res) {
    return userModel.create({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
      id: mongoose.Types.ObjectId(),
      timestamp: moment(),
      imageUrl: '',
    }, (err, user) => {
      if (err) {
        res.status(400).send({
          error_code: 'signup_failed',
          message: 'user sign up failed',
        });
        return;
      }

      res.status(200).send(user);
    });
  },
  authenticate(req, res) {
    return userModel.findOne({
      email: req.body.email,
    }, (err, user) => {
      if (err) {
        console.log(err);
        res.status(400).send({
          error_code: 'login_failed',
          message: 'user login failed',
        });
        return;
      }

      if (user.password === req.body.password) {
        console.log(user);
        const tokenizer = {email: user.email, password: user.password, id: user._id};
        token = jwt.sign(tokenizer, config.secret);
      } else {
        res.status(400).send({
          error_code: 'authentication_failed',
          message: 'Invalid Password',
        });
        return;
      }

      res.status(200).send({
        token,
        message: "Enjoy!!!",
      });
    })
  },
  getAllUsers(req, res) {
    return userModel.find({
      '_id': {
        '$ne': req.decoded.id,
      },
    }, (err, users) => {
      if (err) {
        console.log(err);
        res.status(400).send({
          error_code: 'login_failed',
          message: 'user login failed',
        });
        return;
      }

      res.status(200).send(users);
    });
  },
  getUser(req, res) {
    return userModel.findById(req.body.id ? req.body.id : req.decoded.id, (err, user) => {
      if (err) {
        console.log(err);
        res.status(400).send({
          error_code: 'user_fetch_failed',
          message: 'user fetch failed',
        });
        return;
      }

      res.status(200).send(user);
    });
  },
};
