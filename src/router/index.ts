import express from 'express';

import authentication from './authentication.js';
import directories from './directories.js';
import guidelines from './guidelines.js';
import pages from './pages.js';
import users from './users.js';
import vec from './vec.js';

const router = express.Router();
//router.use(express.json)

export default (): express.Router => {
  authentication(router);
  users(router);
  pages(router);
  guidelines(router);
  vec(router);
  directories(router);
  return router;
};
