import mongoose from "mongoose";
const { Schema } = mongoose;

const tagsSchema = new Schema({
  name: { type: String, required: true, maxLength: 20 },
});

const Tags = mongoose.models.Tags || mongoose.model("Tags", tagsSchema, "tags");

export default Tags;
