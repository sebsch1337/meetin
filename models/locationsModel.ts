import mongoose from "mongoose";
const { Schema } = mongoose;

const locationsSchema = new Schema({
  teamId: { type: String, required: true, length: 24 },
  name: { type: String, required: true, maxLength: 50 },
  address: {
    road: { type: String, maxLength: 100 },
    houseNo: { type: String, maxLength: 5 },
    postcode: { type: String, maxLength: 7 },
    city: { type: String, maxLength: 100 },
    suburb: { type: String, maxLength: 100 },
  },
  city: { type: String, maxLength: 100 },
  description: { type: String, maxLength: 1000 },
  infos: { type: String, maxLength: 1000 },
  tel: { type: String, maxLength: 20 },
  tags: { type: Array, maxLength: 6, default: undefined },
  maxCapacity: { type: Number, min: 1, max: 999 },
  indoor: { type: Boolean },
  outdoor: { type: Boolean },
  noGo: { type: Boolean },
  images: { type: Array, maxLength: 4, default: undefined },
  latitude: { type: Number, min: -90, max: 90 },
  longitude: { type: Number, min: -180, max: 180 },
  //   tripId: { type: mongoose.Schema.Types.ObjectId, ref: "trips" },
});

const Locations = mongoose.models.Locations || mongoose.model("Locations", locationsSchema, "locations");

export default Locations;
