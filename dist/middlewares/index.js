import pkg from 'lodash';
const { merge } = pkg;
import { deleteUserById, getUserBySessionToken, getUsers } from '../db/users.js';
export const isAuthenticated = async (req, res, next) => {
    try {
        const sessionToken = req.cookies['USER-AUTH'];
        if (!sessionToken) {
            console.log("no session token");
            return res.redirect('/login');
        }
        const existingUser = await getUserBySessionToken(sessionToken);
        if (!existingUser) {
            console.log("not authenticated");
            return res.redirect('/login');
        }
        merge(req, { identity: existingUser });
        return next();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
export const existsNamespace = async (req, res, next) => {
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
            console.log(req.body);
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
        return next();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await deleteUserById(id);
        return res.json(deletedUser);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
//# sourceMappingURL=index.js.map