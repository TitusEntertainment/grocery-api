const loginRouter = require('../routes/user/login');
const registerRouter = require('../routes/user/register');
const createListRouter = require('../routes/lists/createList');

const setupRoutes = (app) => {
  app.use('/api/user/', registerRouter, loginRouter);

  app.use('/api/lists/new', createListRouter);
};

module.exports = { setupRoutes };
