import mongoose from "mongoose";
const { Schema } = mongoose;

const locationsSchema = new Schema({
  name: { type: String, required: true },
  address: { type: Object },
  description: { type: String },
  infos: { type: String },
  tags: { type: Array },
  maxCapacity: { type: Number },
  indoor: { type: Boolean },
  outdoor: { type: Boolean },
  noGo: { type: Boolean },
  images: { type: Array },
  //   tripId: { type: mongoose.Schema.Types.ObjectId, ref: "trips" },
});

const Locations = mongoose.models.Locations || mongoose.model("Locations", locationsSchema, "locations");

export default Locations;
