import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
  namespaces: { type: Array<String> },
  currentNamespace: { type: String },

  // Namespaces are legacy, later will update to Directories:
  CurrentDirectory: { type: String, ref: "Directory" },
  VectorQueries: { type: Array<String>, ref: "VectorQueries" },
  CheckingPrompts: { type: Array<String>, ref: "CheckingPrompts" },
  CurrentGuidelineSet: { type: String, ref: "CurrentGuidelineSet" },
});

export const UserModel = mongoose.model("User", UserSchema);
export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({
    "authentication.sessionToken": sessionToken,
  });
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) =>
  UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values);
