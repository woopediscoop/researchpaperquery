import express from 'express';
import { evaluateQuery, makeVectorQuery, getVectoryQuery, findQueries, deleteQuery } from '../controllers/vectorqueries.js';
import { isAuthenticated } from '../middlewares/index.js';

export default(router: express.Router) => {
    router.post('/vec/makequery', isAuthenticated, makeVectorQuery);
    router.post('/vec/updatequery', isAuthenticated, evaluateQuery);
    router.post('/vec/getquery', isAuthenticated, getVectoryQuery);
    router.post('/vec/eval', isAuthenticated, evaluateQuery);
    router.post('/vec/find', isAuthenticated, findQueries);
    router.delete('/vec/delete', isAuthenticated, deleteQuery);

    return router;
}