import mongoose from "mongoose";
const { Schema } = mongoose;

const usersSchema = new Schema({
  name: { type: String, required: true, maxLength: 50 },
  email: { type: String },
  image: { type: String },
  emailVerified: { type: String },
  teamId: { type: String },
});

const Users = mongoose.models.Users || mongoose.model("Users", usersSchema, "users");

export default Users;
