// We grab Schema and model from mongoose library.
const { Schema, model } = require("mongoose");

// We declare new schema.
const ticketSettingsSchema = new Schema({
  gid: { type: String },
  ticketCategory: { type: Number, default: 0 },
  ticketCreationMessageID: { type: Number, default: 0 },
  ticketCreationMessageEmojiID: { type: Number, default: 0 },
  tickets: { type: Map, of: String }
});

// We export it as a mongoose model.
module.exports = model("tickets", ticketSettingsSchema);