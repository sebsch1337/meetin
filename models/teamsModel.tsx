import mongoose from "mongoose";
const { Schema } = mongoose;

const teamsSchema = new Schema({
  name: { type: String, required: true, maxLength: 50 },
  invitedEmails: { type: Array },
  admins: { type: Array },
  users: { type: Array },
});

const Teams = mongoose.models.Teams || mongoose.model("Teams", teamsSchema, "teams");

export default Teams;
