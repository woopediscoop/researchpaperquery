import express from 'express';

import {
    addGuidelineToSet, deleteGuideline, deleteGuidelineSet, getAllGuidelineSets, getCurrentGLSet,
    GetFulfilledGuideline, getGuideline, getGuidelineSet, guidelinesBySetId, makeGuidelineSet,
    MakeOrUpdateFulfilledGuideline, updateGuidelineSetById
} from '../controllers/guidelines.js';

export default (router: express.Router) => {
  router.post("/guidelines/createset", makeGuidelineSet);
  router.post("/guidelines/getsetbyid", getGuidelineSet);
  router.post("/guidelines/add", addGuidelineToSet);
  router.post("/guidelines/get", getGuideline);
  router.post("/guidelines/update", updateGuidelineSetById);
  router.get("/guidelines/getcurrentset", getCurrentGLSet);
  router.get("/guidelines/getsets", getAllGuidelineSets);
  router.post("/guidelines/bysetid", guidelinesBySetId);
  router.delete("/guidelines/deleteset", deleteGuidelineSet);

  router.post("/fulfilled/get", GetFulfilledGuideline);
  router.post("/fulfilled/make", MakeOrUpdateFulfilledGuideline);

  router.delete("/guidelines/delete", deleteGuideline);

  return router;
};
