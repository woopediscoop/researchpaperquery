import mongoose from "mongoose";

const VectorQuerySchema = new mongoose.Schema({
  name: { type: String },
  prompt: { type: String, required: true },
  results: { type: Array<String> },
  containsCorrectPassage: { type: Boolean },
  passageNr: { type: Number },
  note: { type: String },

  User: { type: String, required: true, ref: "User" },
  Guideline: { type: String, required: true, ref: "Guideline" },
  Directory: { type: String, required: true, ref: "Directory" },
});

export const VectorQueryModel = mongoose.model(
  "VectorQuery",
  VectorQuerySchema,
);
export const createVectorQuery = (values: Record<string, any>) =>
  new VectorQueryModel(values).save().then((vquery) => vquery.toObject());
export const getVectorQueryById = (id: string) => VectorQueryModel.findById(id);
export const updateVectorQueryById = (
  id: string,
  values: Record<string, any>,
) => VectorQueryModel.findByIdAndUpdate(id, values);
export const getVectorQueriesByGuideline = (guideline_id: string) =>
  VectorQueryModel.find({ Guideline: guideline_id });
export const getVectorQueriesByGuidelineAndUser = ({ guideline_id, user_id }) =>
  VectorQueryModel.find({ Guideline: guideline_id, User: user_id });
export const getVectorQueriesByUserAndGuidelineSet = (user: string) =>
  VectorQueryModel.find({ User: user });
export const deleteVectorQueryById = (id: string) =>
  VectorQueryModel.findOneAndDelete({ _id: id });

export const queryVectorQueries = (query: Record<string, any>) =>
  VectorQueryModel.find(query);
