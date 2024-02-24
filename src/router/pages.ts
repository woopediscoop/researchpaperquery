import express from 'express';

import {
    renderCreateDir, renderCreateGLPage, renderCreateGLSet, renderDirectoryPage,
    renderEditGuideline, renderFilterQueries, renderGuidelinePage, renderHomePage, renderLoginPage,
    renderNamespaceManager, renderPdfUpload, renderPromptSearch, renderQueryResult,
    renderVectorQuery, renderVectorSearch
} from '../controllers/pages.js';
import { isAuthenticated } from '../middlewares/index.js';

export default (router: express.Router) => {
  router.get("/", isAuthenticated, renderHomePage);
  router.get("/login", renderLoginPage);
  router.get("/namespace", isAuthenticated, renderNamespaceManager);
  router.get("/home", isAuthenticated, renderHomePage);
  router.get("/uploadpdf", isAuthenticated, renderPdfUpload);
  router.get("/vectorsearch", isAuthenticated, renderVectorQuery);
  router.get("/filterqueries", isAuthenticated, renderFilterQueries);
  router.get("/llmsearch", isAuthenticated, renderPromptSearch);
  router.get("/guidelines", isAuthenticated, renderGuidelinePage);

  router.get("/vectorquery", isAuthenticated, renderVectorQuery);
  router.get("/vectorquery/edit/:queryId", isAuthenticated, renderQueryResult);

  router.get("/guidelines/makeglset", isAuthenticated, renderCreateGLSet);
  router.get("/guidelines/addgl", isAuthenticated, renderCreateGLPage);
  router.get("/guidelines/edit/:GLId", isAuthenticated, renderEditGuideline);

  router.get("/directories", isAuthenticated, renderDirectoryPage);
  router.get("/directories/create", isAuthenticated, renderCreateDir);
};
