import mongoose from "mongoose";
const GuidelineSetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    Author: { type: String, ref: 'Author' },
    Guidelines: { type: (Array), ref: 'Guidelines' }
});
const GuidelineSchema = new mongoose.Schema({
    nr: { type: Number, required: true },
    itemToCheck: { type: String, required: true },
    description: { type: String },
    importance: { type: String, required: true },
    note: { type: String },
    GuidelineSet: { type: String, required: true, ref: 'GuidelineSet' }
});
export const GuidelineSetModel = mongoose.model('GuidelineSet', GuidelineSetSchema);
export const createGuidelineSet = (values) => new GuidelineSetModel(values).save().then((gset) => gset.toObject());
export const updateGuidelineSet = (id, values) => GuidelineSetModel.findByIdAndUpdate(id, values);
export const getGuidelineSetByName = (name) => GuidelineSetModel.findOne({ name: name });
export const getGuidelineSetById = (id) => GuidelineSetModel.findById(id);
export const getGuidelineSets = () => GuidelineSetModel.find();
export const deleteGuidelineSetById = (id) => GuidelineSetModel.findOneAndDelete({ _id: id });
export const GuidelineModel = mongoose.model('Guideline', GuidelineSchema);
export const createGuideline = (values) => new GuidelineModel(values).save().then((guideline) => guideline.toObject());
export const getGuidelineBySetAndNr = ({ set_id, nr }) => GuidelineModel.findOne({
    _id: set_id,
    nr: nr
});
export const updateGuideline = (id, values) => GuidelineModel.findByIdAndUpdate(id, values);
export const getGuidelineById = (id) => GuidelineModel.findById(id);
export const deleteGuidelineById = (id) => GuidelineModel.findOneAndDelete({ _id: id });
//# sourceMappingURL=guidelines.js.map