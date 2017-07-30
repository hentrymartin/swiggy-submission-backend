const mongoose = require('mongoose');
const userModel = require('./../models').user;
const commentModel = require('./../models').comment;
const moment = require('moment');

module.exports = {
  create: (req, res) => {
    return userModel.findById(req.decoded.id, (err, user) => {

      if (err) {
        res.status(400).send({
          error_code: 'comment_creation_failed',
          message: 'Comment creation failed',
        });
        return;
      }

      if (!req.body.postId) {
        res.status(400).send({
          error_code: 'post_id_not_found',
          message: 'Post ID is not found in the request',
        });
        return;
      }

      commentModel.create({
        content: req.body.content,
        timestamp: moment(),
        postId: req.body.postId,
        author: {
          name: user.name,
          imageUrl: user.imageUrl,
          id: user._id,
        },
        parentId: req.body.parentId,
      }, (err, comment) => {
        if (err) {
          res.status(400).send({
            error_code: 'comment_creation_failed',
            message: 'Comment creation failed',
          });
          return;
        }

        res.status(200).send(comment);
      });
    })
  },
};