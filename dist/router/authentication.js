import { register, login } from '../controllers/authentication.js';
export default (router) => {
    router.post('/auth/register', register);
    router.post('/auth/login', login);
};
//# sourceMappingURL=authentication.js.map