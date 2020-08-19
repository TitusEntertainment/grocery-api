const express = require('express');
const helmet = require('helmet');
require('dotenv').config();
const { setupDB } = require('./db/db');
const PORT = process.env.PORT || 1982;
const { setupRoutes } = require('./helpers/routes');

const init = async () => {
  await setupDB(process.env.MONGO_URI, process.env.DB_NAME);
  const app = express();

  app.use(express.json({ limit: '100kb', strict: true, type: 'application/json' }));
  app.use(helmet());

  setupRoutes(app);

  app.listen(PORT, () => console.log(`API has started on port: ${PORT}`));
};

init().catch((err) => console.log(`Failed to start API: ${err}`));
