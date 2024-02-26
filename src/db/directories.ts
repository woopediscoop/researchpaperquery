import mongoose from 'mongoose';

const DirectorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  pdfname: { type: String },
  GuidelineSets: { type: Array<String> },
});

const GuidelineFulfilledSchema = new mongoose.Schema({
  passages: { type: String },

  VectorQueries: { type: Array<String>, ref: "VectorQuery" },
  Directory: { type: String, required: true, ref: "Directory" },
  Guideline: { type: String, required: true, ref: "Guideline" },
});

export const DirectoryModel = mongoose.model("Directory", DirectorySchema);
export const createDirectory = (values: Record<string, any>) =>
  new DirectoryModel(values).save().then((dir) => dir.toObject());
export const getDirectories = () => DirectoryModel.find();
export const getDirectoryById = (id: String) => DirectoryModel.findById(id);
export const deleteDirectoryById = (id: String) =>
  DirectoryModel.findOneAndDelete({ _id: id });

export const GuidelineFulfilledModel = mongoose.model(
  "CorrectPassages",
  GuidelineFulfilledSchema,
);
export const createFulfilledGuideline = (values: Record<string, any>) =>
  new GuidelineFulfilledModel(values)
    .save()
    .then((correctPassage) => correctPassage.toObject());
export const getFulfilledGuidelineByGuidelineAndDirectory = ({
  guideline_id,
  directory_id,
}) =>
  GuidelineFulfilledModel.findOne({
    Guideline: guideline_id,
    Directory: directory_id,
  });
export const updateFulfilledGuidelineByGuidelineAndDirectory = ({
  guideline_id,
  directory_id,
  values,
}) =>
  GuidelineFulfilledModel.findOneAndUpdate(
    { Guideline: guideline_id, Directory: directory_id },
    values,
  );
export const deleteFulfilledGuidelineById = (id: String) =>
  GuidelineFulfilledModel.findOneAndDelete({ _id: id });
