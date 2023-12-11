import { renderLoginPage, renderNamespaceManager, renderHomePage, renderPdfUpload, renderVectorSearch, renderPromptSearch } from '../controllers/pages.js';
import { isAuthenticated } from '../middlewares/index.js';
export default (router) => {
    router.get('/', renderHomePage);
    router.get('/login', renderLoginPage);
    router.get('/namespace', isAuthenticated, renderNamespaceManager);
    router.get('/home', isAuthenticated, renderHomePage);
    router.get('/uploadpdf', isAuthenticated, renderPdfUpload);
    router.get('/vectorsearch', isAuthenticated, renderVectorSearch);
    router.get('/llmsearch', isAuthenticated, renderPromptSearch);
};
//# sourceMappingURL=pages.js.map