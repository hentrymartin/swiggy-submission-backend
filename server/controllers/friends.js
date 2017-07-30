const mongoose = require('mongoose');
const userModel = require('./../models').user;
const friendsModel = require('./../models').friends;
const moment = require('moment');


module.exports = {
  makeFriends(req, res) {
    return userModel.findById(req.body.id, (err, user) => {
      if (err) {
        res.status(400).send({
          error_code: 'friend_request_failed',
          message: 'Friend Request Failed',
        });
        return;
      }

      friendsModel.create({
        name: user.name,
        userId: req.decoded.id,
        email: user.email,
        timestamp: moment(),
        imageUrl: user.imageUrl,
      }, (err, friend) => {
        if (err) {
          console.log(err);
          res.status(400).send({
            error_code: 'friend_request_failed',
            message: 'Friend Request Failed',
          });
          return;
        }

        res.status(200).send(friend);
      });

    });
  },
  getFriends(req, res) {
    return friendsModel.find({ 'userId': req.decoded.id}, (err, friends) => {
      if (err) {
        res.status(400).send({
          error_code: 'friends_retrieval_failed',
          message: 'Friend Retrieval Failed',
        });
        return;
      }

      res.status(200).send(friends);
    });
  }
};
