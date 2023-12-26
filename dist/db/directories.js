import mongoose from 'mongoose';
const DirectorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    pdfname: { type: String },
    GuidelineSets: { type: (Array) }
});
const GuidelineFulfilledSchema = new mongoose.Schema({
    passages: { type: String },
    VectorQueries: { type: (Array), ref: 'VectorQuery' },
    Directory: { type: String, required: true, ref: 'Directory' },
    Guideline: { type: String, required: true, ref: 'Guideline' },
});
export const DirectoryModel = mongoose.model('Directory', DirectorySchema);
export const createDirectory = (values) => new DirectoryModel(values).save().then((dir) => dir.toObject());
export const getDirectories = () => DirectoryModel.find();
export const getDirectoryById = (id) => DirectoryModel.findById(id);
export const deleteDirectoryById = (id) => DirectoryModel.findOneAndDelete({ _id: id });
export const GuidelineFulfilledModel = mongoose.model('CorrectPassages', GuidelineFulfilledSchema);
export const createFulfilledGuideline = (values) => new GuidelineFulfilledModel(values).save().then((correctPassage) => correctPassage.toObject());
export const getFulfilledGuidelineByGuidelineAndDirectory = ({ guideline_id, directory_id }) => GuidelineFulfilledModel.findOne({ Guideline: guideline_id, Directory: directory_id });
export const updateFulfilledGuidelineByGuidelineAndDirectory = ({ guideline_id, directory_id, values }) => GuidelineFulfilledModel.findOneAndUpdate({ Guideline: guideline_id, Directory: directory_id }, values);
export const deleteFulfilledGuidelineById = (id) => GuidelineFulfilledModel.findOneAndDelete({ _id: id });
//# sourceMappingURL=directories.js.map