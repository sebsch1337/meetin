import mongoose from "mongoose";
const { Schema } = mongoose;

const tagsSchema = new Schema({
  name: { type: String, required: true },
  //   tripId: { type: mongoose.Schema.Types.ObjectId, ref: "trips" },
});

const Tags = mongoose.models.Tags || mongoose.model("Tags", tagsSchema, "tags");

export default Tags;
