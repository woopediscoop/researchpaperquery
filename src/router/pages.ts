import express from 'express';
import { renderLoginPage, renderNamespaceManager, renderHomePage, renderPdfUpload, renderVectorSearch, renderPromptSearch } from '../controllers/pages.js';
import { isAuthenticated } from '../middlewares/index.js';


export default(router: express.Router) => {
    router.get('/', renderHomePage)
    router.get('/login', renderLoginPage);
    router.get('/namespace', isAuthenticated, renderNamespaceManager);
    router.get('/home', isAuthenticated, renderHomePage)
    router.get('/uploadpdf', isAuthenticated, renderPdfUpload)
    router.get('/vectorsearch', isAuthenticated, renderVectorSearch)
    router.get('/llmsearch', isAuthenticated, renderPromptSearch)
}
