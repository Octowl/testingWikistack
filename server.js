var app = require('./app');
var models = require('./models');

Promise.all([
  models.User.sync(),
  models.Page.sync()
])
.then(function () {
  app.listen(3001, function () {
    console.log('Server is listening on port 3001!');
  });
})
.catch(console.error);