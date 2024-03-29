import mongoose from "mongoose";

const { Schema } = mongoose;

const eventsSchema = new Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: "teams" },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: "locations" },
  name: { type: String, required: true, maxLength: 50 },
  dateTime: { type: Date, required: true },
  going: { type: Number, max: 999 },
  announced: { type: Number, max: 999 },
  visitors: { type: Number, max: 999 },
  description: { type: String, maxLength: 1000 },
  preNotes: { type: String, maxLength: 1000 },
  postNotes: { type: String, maxLength: 1000 },
  fbLink: { type: String, maxLength: 100 },
});

const Events = mongoose.models.Events || mongoose.model("Events", eventsSchema, "events");

export default Events;
