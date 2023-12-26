import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const renderEditGuideline = async (req, res) => {
    return res.sendFile(path.join(__dirname, '../public/editguideline.html'));
};
export const renderFilterQueries = async (req, res) => {
    return res.sendFile(path.join(__dirname, '../public/filterqueries.html'));
};
export const renderVectorQuery = async (req, res) => {
    return res.sendFile(path.join(__dirname, '../public/vectorquery.html'));
};
export const renderQueryResult = async (req, res) => {
    return res.sendFile(path.join(__dirname, '../public/vecqueryresult.html'));
};
export const renderCreateDir = async (req, res) => {
    return res.sendFile(path.join(__dirname, '../public/createdirectory.html'));
};
export const renderDirectoryPage = async (req, res) => {
    return res.sendFile(path.join(__dirname, '../public/directorylanding.html'));
};
export const renderCreateGLPage = async (req, res) => {
    return res.sendFile(path.join(__dirname, '../public/addgl.html'));
};
export const renderGuidelinePage = async (req, res) => {
    return res.sendFile(path.join(__dirname, '../public/chooseglset.html'));
};
export const renderCreateGLSet = async (req, res) => {
    return res.sendFile(path.join(__dirname, '../public/createglset.html'));
};
export const renderLoginPage = async (req, res) => {
    return res.sendFile(path.join(__dirname, '../public/index.html'));
};
export const renderNamespaceManager = async (req, res) => {
    try {
        return res.sendFile(path.join(__dirname, '../public/namespaceconfig.html'));
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
export const renderHomePage = async (req, res) => {
    try {
        return res.sendFile(path.join(__dirname, '../public/home.html'));
    }
    catch (error) {
        console.log(error);
    }
};
export const renderPdfUpload = async (req, res) => {
    try {
        return res.sendFile(path.join(__dirname, '../public/pdfupload.html'));
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
export const renderVectorSearch = async (req, res) => {
    try {
        return res.sendFile(path.join(__dirname, '../public/vecsearch.html'));
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
export const renderPromptSearch = async (req, res) => {
    try {
        return res.sendFile(path.join(__dirname, '../public/promptsearch.html'));
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
//# sourceMappingURL=pages.js.map