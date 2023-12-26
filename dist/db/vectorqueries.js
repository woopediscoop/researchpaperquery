import mongoose from 'mongoose';
const VectorQuerySchema = new mongoose.Schema({
    name: { type: String },
    prompt: { type: String, required: true },
    results: { type: (Array) },
    containsCorrectPassage: { type: Boolean },
    passageNr: { type: Number },
    note: { type: String },
    User: { type: String, required: true, ref: 'User' },
    Guideline: { type: String, required: true, ref: 'Guideline' },
    Directory: { type: String, required: true, ref: 'Directory' },
});
export const VectorQueryModel = mongoose.model('VectorQuery', VectorQuerySchema);
export const createVectorQuery = (values) => new VectorQueryModel(values).save().then((vquery) => vquery.toObject());
export const getVectorQueryById = (id) => VectorQueryModel.findById(id);
export const updateVectorQueryById = (id, values) => VectorQueryModel.findByIdAndUpdate(id, values);
export const getVectorQueriesByGuideline = (guideline_id) => VectorQueryModel.find({ Guideline: guideline_id });
export const getVectorQueriesByGuidelineAndUser = ({ guideline_id, user_id }) => VectorQueryModel.find({ Guideline: guideline_id, User: user_id });
export const getVectorQueriesByUserAndGuidelineSet = (user) => VectorQueryModel.find({ User: user });
export const deleteVectorQueryById = (id) => VectorQueryModel.findOneAndDelete({ _id: id });
export const queryVectorQueries = (query) => VectorQueryModel.find(query);
//# sourceMappingURL=vectorqueries.js.map