import mongoose from "mongoose";
const PromptSchema = new mongoose.Schema({
    name: { type: String, required: true },
    passages: { type: Array(), required: true },
    prompt: { type: String, required: true },
    entirePrompt: { type: String },
    SystemPrompt: { type: String, ref: "SystemPrompt" },
    Guideline: { type: String, required: true, ref: "Guideline" },
    Directory: { type: String, required: true, ref: "Directory" },
    User: { type: String, required: true, ref: "User" },
});
export const PromptModel = mongoose.model("Prompt", PromptSchema);
export const createPrompt = (values) => new PromptModel(values).save().then((prompt) => prompt.toObject());
export const getPromptById = (id) => PromptModel.findOne({ _id: id });
//# sourceMappingURL=prompt.js.map