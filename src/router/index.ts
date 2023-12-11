import express from 'express';
import authentication from './authentication.js';
import pages from './pages.js';
import users from './users.js';

const router = express.Router();
//router.use(express.json)

export default(): express.Router => {
    authentication(router);
    users(router);
    pages(router);
    return router;
};