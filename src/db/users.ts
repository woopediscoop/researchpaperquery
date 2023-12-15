import mongoose, { mongo } from "mongoose";   

 const UserSchema = new mongoose.Schema({
    username : {type:String, required:true},
    email: { type:String, required:true},
    authentication: {
        password: {type:String, required: true, select:false},
        salt: {type:String, select: false},
        sessionToken:{type:String, select:false},
    },
    namespaces: {type:Array<String>},
    currentNamespace: {type:String},

    // Namespaces are legacy, later will update to Directories:
    CurrentDirectory: {type:mongoose.Schema.Types.ObjectId, ref:'Directory'},
    VectorQueries: {type:Array<mongoose.Schema.Types.ObjectId>, ref:'VectorQueries'},
    CheckingPrompts: {type:Array<mongoose.Schema.Types.ObjectId>, ref:'CheckingPrompts'},

 });

 const DirectorySchema = new mongoose.Schema({
   name: {type:String, required:true},
   description: {type:String},
   pdfname: {type:String},
 });

 const GuidelineSetSchema = new mongoose.Schema({
   name:{type:String, required: true},

   Guidelines:{type:Array<mongoose.Schema.Types.ObjectId>, ref:'Guidelines'}
 });

 const GuidelineSchema = new mongoose.Schema({
   nr:{type:Number, required:true},
   itemToCheck:{type:String, required: true},
   description:{type:String},
   importance:{type:String, required: true},
   note:{type:String},

   GuidelineSet:{type: mongoose.Schema.Types.ObjectId, required: true, ref:'GuidelineSet'}
 });

 const VectorQuerySchema = new mongoose.Schema({
   prompt: {type:String, required:true},
   results : {type:Array<String>},
   containsCorrectPassage: {type:Boolean},
   note: {type:String},
   
   User: {type:mongoose.Schema.Types.ObjectId, required: true, ref:'User'},
   CorrectPassages: {type:mongoose.Schema.Types.ObjectId},
   Guideline: {type:mongoose.Schema.Types.ObjectId, required: true, ref:'Guideline'},
   Namespace: {type:mongoose.Schema.Types.ObjectId, required: true, ref:'Namespace'},
 });

 const CorrectPassagesSchema = new mongoose.Schema({
   passages:{type:Array<String>, required: true},

   Directory:{type:mongoose.Schema.Types.ObjectId, required: true, ref:'Directory'},
   Guideline:{type:mongoose.Schema.Types.ObjectId, required: true, ref:'Guideline'},
 })

 const CheckingPromptSchema = new mongoose.Schema({
   setup_1: {type:String},
   setup_2: {type:String},
   passages: {type:Array<String>, required:true},
   prompt: {type:String, required:true},
   entirePrompt: {type:String},
   isCorrectResult: {type:Boolean},
   note: {type:String},

   Guideline: {type:mongoose.Schema.Types.ObjectId, required: true, ref:'Guideline'},
   VectorResult: {type:mongoose.Schema.Types.ObjectId, required: true, ref:'VectorQuery'},
   Directory: {type:mongoose.Schema.Types.ObjectId, required: true, ref:'Directory'},
   User: {type:mongoose.Schema.Types.ObjectId, required: true, ref:'User'},
 })


   
 export const DirectoryModel = mongoose.model('Directory', DirectorySchema);
 export const createDirectory = (values: Record<string, any>) => new DirectoryModel(values).save().then((dir) => dir.toObject());
 export const getDirectories = () => DirectoryModel.find();
 export const getDirectoryById = (id: mongoose.Schema.Types.ObjectId) => DirectoryModel.findById(id);

 export const GuidelineSetModel = mongoose.model('GuidelineSet', GuidelineSetSchema);
 export const createGuidelineSet = (values : Record<string, any>) => new GuidelineSetModel(values).save().then((gset) => gset.toObject());
 export const getGuidelineSetByName = (name: string) => GuidelineSetModel.findOne({name: name});

 export const GuidelineModel = mongoose.model('Guideline', GuidelineSchema);
 export const createGuideline = (values: Record<string, any>) => new GuidelineModel(values).save().then((guideline) => guideline.toObject());
 export const getGuidelineBySetAndNr = ({set_id, nr}) => GuidelineModel.findOne({
   _id:set_id,
   nr:nr
 });

 export const VectorQueryModel = mongoose.model('VectorQuery', VectorQuerySchema);
 export const createVectorQuery = (values : Record<string, any>) => new VectorQueryModel(values).save().then((vquery) => vquery.toObject());
 export const getVectorQueryByGuideline = (guideline_id : mongoose.Schema.Types.ObjectId) => VectorQueryModel.findOne({Guideline:guideline_id});
 export const getVectorQueryByGuidelineAndUser = ({guideline_id, user_id}) => VectorQueryModel.findOne({Guideline:guideline_id, User:user_id});
 export const getVectorQueryByUserAndGuidelineSet = (user : mongoose.Schema.Types.ObjectId) => VectorQueryModel.findOne({User:user});

 export const CorrectPassagesModel = mongoose.model('CorrectPassages', CorrectPassagesSchema);
 export const createCorrectPassages = (values: Record<string, any>) => new CorrectPassagesModel(values).save().then((correctPassage) => correctPassage.toObject());
 export const getCorrectPassagesByGuidelineAndDirectory = ({guideline_id, directory_id}) => CorrectPassagesModel.findOne({Guideline:guideline_id,Directory:directory_id});
 export const updateCorrectPassagesByGuidelineAndDirectory = ({guideline_id, directory_id, passages}) => CorrectPassagesModel.findOneAndUpdate({Guideline:guideline_id,Directory:directory_id},{passages:passages})

 export const CheckingPromptModel = mongoose.model('CheckingPrompt', CheckingPromptSchema);
 export const createCheckingPrompt = (values: Record<string, any>) => new CheckingPromptModel(values).save().then((checkingPrompt) => checkingPrompt.toObject());
 export const getCheckingPromptByVectorQuery = (vectorquery_id: mongoose.Schema.Types.ObjectId) => CheckingPromptModel.findOne({VectorResult:vectorquery_id});
 export const getCheckingPromptByVectorQueryAndUser = ({vectorquery_id,user_id}) => CheckingPromptModel.findOne({VectorResult:vectorquery_id, User:user_id});

 

 export const UserModel = mongoose.model('User', UserSchema);
 export const getUsers = () => UserModel.find();
 export const getUserByEmail = (email: string) => UserModel.findOne({email});
 export const getUserBySessionToken = (sessionToken : string) => UserModel.findOne({
    'authentication.sessionToken': sessionToken,
 });
 export const getUserById = (id: string) => UserModel.findById(id);
 export const createUser = (values: Record<string, any>) => new UserModel(values).save().then((user) => user.toObject());
 export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id })
 export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values); 

 