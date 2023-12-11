import { getUserByEmail, createUser } from "../db/users.js";
import { random, authentication } from '../helpers/index.js';
const host = 'https://researchpaperquery.azurewebsites.net';
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            console.log("no email or pw");
            return res.sendStatus(400);
        }
        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        if (!user) {
            console.log("User doesn't exist");
            return res.sendStatus(400);
        }
        const expectedHash = authentication(user.authentication.salt, password);
        if (user.authentication.password != expectedHash) {
            console.log("Wrong password");
            return res.sendStatus(403);
        }
        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());
        await user.save();
        res.cookie('USER-AUTH', user.authentication.sessionToken, { domain: host, path: '/' });
        return res.json({ 'page': 'home' });
        //return res.status(200).json(user).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
export const register = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            console.log("email user and password");
            return res.sendStatus(400);
        }
        const existingUser = await getUserByEmail(email);
        setTimeout(() => {
            console.log(existingUser);
        }, 5000);
        if (existingUser) {
            console.log("user exists already");
            return res.sendStatus(400);
        }
        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password),
            }
        });
        return res.status(200).json(user).end();
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
//# sourceMappingURL=authentication.js.map