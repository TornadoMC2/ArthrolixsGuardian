// We grab Schema and model from mongoose library.
const { Schema, model } = require("mongoose");

// We declare new schema.
const ticketSettingsSchema = new Schema({
  gid: { type: String },
  ticketCategory: { type: String, default: "null" },
  ticketCreationMessageID: { type: String, default: "null" },
  ticketCreationMessageEmojiID: { type: String, default: "null" },
  ticketStaffRoleID: { type: String, default: "null" },
  tickets: { type: Number, default: 0 }
});

// We export it as a mongoose model.
module.exports = model("tickets", ticketSettingsSchema);