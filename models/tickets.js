// We grab Schema and model from mongoose library.
const { Schema, model } = require("mongoose");

// We declare new schema.
const ticketSettingsSchema = new Schema({
  gid: { type: String },
  ticketCategory: { type: Number },
  ticketCreationMessageID: { type: Number },
  ticketCreationMessageEmojiID: { type: Number }
});

// We export it as a mongoose model.
module.exports = model("tickets", ticketSettingsSchema);