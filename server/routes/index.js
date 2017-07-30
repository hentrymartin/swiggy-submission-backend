const usersController = require('../controllers').user;
const postController = require('../controllers').post;
const commentController = require('../controllers').comment;
const friendsController = require('../controllers').friends;

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'This is not allowed!',
  }));

  // Users api's
  app.post('/api/user/create', usersController.create);
  app.post('/api/user/authenticate', usersController.authenticate);
  app.get('/api/users', usersController.getAllUsers);
  app.get('/api/user', usersController.getUser);


  // Post api's
  app.post('/api/post/create', postController.create);
  app.get('/api/post', postController.getAllPost);

  // Comment api's
  app.post('/api/comment/create', commentController.create);

  // Friends api's
  app.post('/api/friends/make', friendsController.makeFriends);
  app.get('/api/friends', friendsController.getFriends);

};