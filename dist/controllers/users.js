import { getUsers, getUserBySessionToken, updateUserById } from '../db/users.js';
import { QueryPine } from '../scripts/pinecone.js';
import { Prompt } from '../scripts/llm.js';
import pkg from 'lodash';
import PdfParse from 'pdf-parse';
const { get } = pkg;
export const getAllUsers = async (req, res) => {
    try {
        const users = await getUsers();
        return res.status(200).json(users);
    }
    catch (error) {
        console.log("error");
        return res.sendStatus(400);
    }
};
export const getCurrentUser = async (req, res) => {
    try {
        const sessionToken = req.cookies['USER-AUTH'];
        if (!sessionToken) {
            console.log("Session Token doesn't exist");
            res.sendStatus(400);
        }
        const user = await getUserBySessionToken(sessionToken);
        console.log(user);
        if (!user) {
            user._id;
            console.log("User doesn't exist");
            return res.sendStatus(400);
        }
        return res.json({ user: user });
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
export const updateUserCurrentGLSet = async (req, res) => {
    try {
        const currentgl_id = req.body.guidelineset;
        const sessionToken = req.cookies['USER-AUTH'];
        if (!sessionToken) {
            console.log("Session Token doesn't exist");
            res.sendStatus(400);
        }
        const user = await getUserBySessionToken(sessionToken);
        if (!user) {
            user._id;
            console.log("User doesn't exist");
            return res.sendStatus(400);
        }
        const updatedUser = await updateUserById(user.id, { CurrentGuidelineSet: currentgl_id });
        return res.json(updatedUser);
    }
    catch (error) {
        return res.json({ error: error });
    }
};
export const postNamespaceBySessionToken = async (req, res) => {
    try {
        const sessionToken = req.cookies['USER-AUTH'];
        if (!sessionToken) {
            console.log("Session Token doesn't exist");
            return res.sendStatus(400);
        }
        const user = await getUserBySessionToken(sessionToken);
        if (!user) {
            console.log("User doesn't exist");
            return res.sendStatus(400);
        }
        const newNamespace = req.body.newnamespace;
        if (!newNamespace) {
            console.log("Namespace parameter missing");
            return res.sendStatus(400);
        }
        let allNamespaces = [];
        const users = await getUsers();
        users.forEach(user => {
            allNamespaces.push(...user.namespaces);
            console.log(allNamespaces);
        });
        if (allNamespaces.includes(newNamespace)) {
            console.log("Index already exists");
            return res.json({ 'message': 'Namespace already exists!',
                'success': false });
        }
        const updatedNamespaces = [...user.namespaces, newNamespace];
        await updateUserById(user._id.toString(), { namespaces: updatedNamespaces });
        return res.json({ 'message': 'Namespace added!', 'success': true });
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
export const postPDF = async (req, res) => {
    try {
        const sessionToken = req.cookies['USER-AUTH'];
        if (!sessionToken) {
            console.log("Session Token doesn't exist");
            return res.sendStatus(400);
        }
        const user = await getUserBySessionToken(sessionToken);
        if (!user) {
            console.log("User doesn't exist");
            return res.sendStatus(400);
        }
        console.log(req);
        PdfParse(req.body.file).then(function (data) {
            console.log(data.text);
            return res.sendStatus(200);
        });
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
export const vectorQuery = async (req, res) => {
    return res.json(await QueryPine(req.body.name, req.body.namespace, req.body.query));
};
export const promptQuery = async (req, res) => {
    const llmResponse = await Prompt(req.body.llmprompt);
    return res.json(llmResponse);
};
export const selectNamespaceBySessionToken = async (req, res) => {
    try {
        const sessionToken = req.cookies['USER-AUTH'];
        if (!sessionToken) {
            console.log("Session Token doesn't exist");
            return res.sendStatus(400);
        }
        const user = await getUserBySessionToken(sessionToken);
        if (!user) {
            console.log("User doesn't exist");
            return res.sendStatus(400);
        }
        const selectedNamespace = req.body.currentNamespace;
        if (!selectedNamespace) {
            console.log("Namespace parameter missing");
            return res.sendStatus(400);
        }
        if (user.namespaces.includes(selectedNamespace)) {
            await updateUserById(user._id.toString(), { currentNamespace: selectedNamespace });
            return res.sendStatus(200);
        }
        else {
            console.log("Namespace doesn't exist");
            return res.sendStatus(400);
        }
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
export const getNamespacesBySessionToken = async (req, res) => {
    try {
        const sessionToken = req.cookies['USER-AUTH'];
        if (!sessionToken) {
            console.log("Session Token doesn't exist");
            return res.sendStatus(400);
        }
        const user = await getUserBySessionToken(sessionToken);
        if (!user) {
            console.log("User doesn't exist");
            return res.sendStatus(400);
        }
        ;
        return res.json({
            namespaces: user.namespaces
        });
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
export const getCurrentNamespaceBySessionToken = async (req, res) => {
    try {
        const sessionToken = req.cookies['USER-AUTH'];
        if (!sessionToken) {
            console.log("Session Token doesn't exist");
            return res.sendStatus(400);
        }
        const user = await getUserBySessionToken(sessionToken);
        if (!user) {
            console.log("User doesn't exist");
            return res.sendStatus(400);
        }
        ;
        return res.json({
            namespace: user.currentNamespace
        });
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
//# sourceMappingURL=users.js.map