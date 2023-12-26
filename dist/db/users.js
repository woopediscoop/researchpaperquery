import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false },
    },
    namespaces: { type: (Array) },
    currentNamespace: { type: String },
    // Namespaces are legacy, later will update to Directories:
    CurrentDirectory: { type: String, ref: 'Directory' },
    VectorQueries: { type: (Array), ref: 'VectorQueries' },
    CheckingPrompts: { type: (Array), ref: 'CheckingPrompts' },
    CurrentGuidelineSet: { type: String, ref: 'CurrentGuidelineSet' },
});
export const UserModel = mongoose.model('User', UserSchema);
export const getUsers = () => UserModel.find();
export const getUserByEmail = (email) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken) => UserModel.findOne({
    'authentication.sessionToken': sessionToken,
});
export const getUserById = (id) => UserModel.findById(id);
export const createUser = (values) => new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id) => UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id, values) => UserModel.findByIdAndUpdate(id, values);
//# sourceMappingURL=users.js.map