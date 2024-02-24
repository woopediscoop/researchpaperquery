import mongoose from 'mongoose';

const SystemPromptSchema = new mongoose.Schema({
  name: { type: String, required: true },
  prompt: { type: String, required: true },

  User: { type: String, required: true, ref: "User" },
});

export const SystemPromptModel = mongoose.model(
  "SystemPrompt",
  SystemPromptSchema,
);
export const createSystemPrompt = (values: Record<string, any>) =>
  new SystemPromptModel(values)
    .save()
    .then((systemPrompt) => systemPrompt.toObject());
export const getSystemPromptById = (id: String) =>
  SystemPromptModel.findOne({ _id: id });
