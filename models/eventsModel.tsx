import mongoose from "mongoose";
const { Schema } = mongoose;

const eventsSchema = new Schema({
  name: { type: String, required: true },
  dateTime: { type: Number },
  locationId: { type: String },
  announced: { type: Number },
  visitors: { type: Number },
  preNotes: { type: String },
  postNotes: { type: String },
  fbLink: { type: String },

  //   tripId: { type: mongoose.Schema.Types.ObjectId, ref: "trips" },
});

const Events = mongoose.models.Events || mongoose.model("Events", eventsSchema, "events");

export default Events;
