import mongoose from 'mongoose';

const ResultsSchema = new mongoose.Schema({
    correct : {type:Boolean, required: true},
    explanation : {type:String},

    Guideline: {type:String, required: true, ref:'Guideline'},
    Directory: {type:String, required: true, ref:'Directory'},
    User: {type:String, required: true, ref:'User'},
    VectorQuery: { type: String, required: true },
    Prompt: { type: String, required: true }
});

export const ResultsModel = mongoose.model('Results', ResultsSchema);
export const createResults = (values : Record<string, any>) => new ResultsModel(values).save().then((results) => results.toObject());
export const getResultsById = (id: string) => ResultsModel.findById(id);
export const getResultsByGuidelineAndDirectory = ({guideline_id, directory_id}) => ResultsModel.find({Guideline:guideline_id, Directory:directory_id});
