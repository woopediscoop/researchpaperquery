import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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