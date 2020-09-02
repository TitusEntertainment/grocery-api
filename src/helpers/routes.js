const loginRouter = require('../routes/user/login');
const registerRouter = require('../routes/user/register');
const userUpdateRouter = require('../routes/user/update');
const createListRouter = require('../routes/lists/create');
const deleteListRouter = require('../routes/lists/delete');
const updateListRouter = require('../routes/lists/update');
const followUserRouter = require('../routes/user/friendRequest');

const setupRoutes = (app) => {
  app.use('/api/user/', registerRouter, loginRouter, userUpdateRouter, followUserRouter);

  app.use('/api/lists/', createListRouter, deleteListRouter, updateListRouter);
};

module.exports = { setupRoutes };
