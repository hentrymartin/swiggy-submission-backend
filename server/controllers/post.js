const mongoose = require('mongoose');
const userModel = require('./../models').user;
const postModel = require('./../models').post;
const commentModel = require('./../models').comment;
const moment = require('moment');

module.exports = {
  create(req, res) {
    return userModel.findById(req.decoded.id, (err, user) => {
      if (err) {
        res.status(400).send({
          error_code: 'post_creation_failed',
          message: 'Post creation failed',
        });
        return;
      }

      postModel.create({
        content: req.body.content,
        timestamp: moment(),
        author: {
          name: user.name,
          imageUrl: user.imageUrl,
          id: user._id,
        },
      }, (err, post) => {
        if (err) {
          res.status(400).send({
            error_code: 'post_creation_failed',
            message: 'Post creation failed',
          });
          return;
        }

        res.status(200).send(post);
      });
    });
  },
  getAllPost(req, res) {
    return postModel.find({
      'author.id': req.decoded.id,
    }).sort({ timestamp: -1 }).exec((err, posts) => {
      if (err) {
        res.status(400).send({
          error_code: 'post_fetching_failed',
          message: 'Fetching post failed',
        });
        return;
      }

      commentModel.find({
        'author.id': req.decoded.id,
      }, (err, comments) => {
        if (err) {
          res.status(400).send({
            error_code: 'post_fetching_failed',
            message: 'Fetching post failed',
          });
          return;
        }

        const structuredPost = posts.map((post) => {
          const commentsForThisPost = comments.filter((comment) => {
            return comment.postId.equals(post._id);
          });


          const idMap = {};
          const restructuredComments = [];
          for(let i = 0; i < commentsForThisPost.length; i++) {
            const datum = commentsForThisPost[i];
            const comment = {};
            comment.content = datum.content;
            comment._id = datum._id;
            comment.timestamp = datum.timestamp;
            comment.postId = datum.postId;
            comment.parentId = datum.parentId;
            comment.author = datum.author;
            comment.comments = [];
            idMap[comment._id] = comment;
            
            if(!comment.parentId) {
              restructuredComments.push(comment);
            } else {
              parentNode = idMap[comment.parentId];
              parentNode.comments.push(comment);
            }
          }

          const reformattedObject = {};
          reformattedObject.name = post.name;
          reformattedObject.content = post.content;
          reformattedObject.author = post.author;
          reformattedObject.timestamp = post.timestamp;
          reformattedObject._id = post._id;
          reformattedObject.comments = restructuredComments;
          return reformattedObject;
        });
        res.status(200).send(structuredPost);
      });
    });
  }
};
