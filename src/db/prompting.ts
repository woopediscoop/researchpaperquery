import mongoose from 'mongoose';

const CheckingPromptSchema = new mongoose.Schema({
    setup_1: {type:String},
    setup_2: {type:String},
    passages: {type:Array<String>, required:true},
    prompt: {type:String, required:true},
    entirePrompt: {type:String},
    isCorrectResult: {type:Boolean},
    note: {type:String},
 
    Guideline: {type:String, required: true, ref:'Guideline'},
    VectorResult: {type:String, required: true, ref:'VectorQuery'},
    Directory: {type:String, required: true, ref:'Directory'},
    User: {type:String, required: true, ref:'User'},
  });
 
  
  export const CheckingPromptModel = mongoose.model('CheckingPrompt', CheckingPromptSchema);
  export const createCheckingPrompt = (values: Record<string, any>) => new CheckingPromptModel(values).save().then((checkingPrompt) => checkingPrompt.toObject());
  export const getCheckingPromptByVectorQuery = (vectorquery_id: String) => CheckingPromptModel.findOne({VectorResult:vectorquery_id});
  export const getCheckingPromptByVectorQueryAndUser = ({vectorquery_id,user_id}) => CheckingPromptModel.findOne({VectorResult:vectorquery_id, User:user_id});
  export const deleteCheckingPromptById = (id : String) => CheckingPromptModel.findOneAndDelete({_id:id});