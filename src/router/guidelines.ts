import express from 'express';
import { makeGuidelineSet, addGuidelineToSet, getAllGuidelineSets, deleteGuidelineSet, guidelinesBySetId } from '../controllers/guidelines.js';

export default(router: express.Router) => {
    router.post('/guidelines/createset', makeGuidelineSet);
    router.post('/guidelines/add', addGuidelineToSet)
    router.get('/guidelines/getsets', getAllGuidelineSets);
    router.get('/guidelines/bysetid', guidelinesBySetId)
    router.delete('/guidelines/deleteset', deleteGuidelineSet);
    
    return router;
}