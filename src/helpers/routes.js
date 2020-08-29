const loginRouter = require('../routes/user/login');
const registerRouter = require('../routes/user/register');
const createListRouter = require('../routes/lists/create');
const deleteListRouter = require('../routes/lists/delete');
const updateListRouter = require('../routes/lists/update');

const setupRoutes = (app) => {
  app.use('/api/user/', registerRouter, loginRouter);

  app.use('/api/lists/', createListRouter, deleteListRouter, updateListRouter);
};

module.exports = { setupRoutes };
