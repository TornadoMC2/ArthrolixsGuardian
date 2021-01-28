// We grab Schema and model from mongoose library.
const { Schema, model } = require("mongoose");

// We declare new schema.
const tagSettingsSchema = new Schema({
  gid: { type: String },
  tags: { type: Map, of: String }
});

// We export it as a mongoose model.
module.exports = model("tags", tagSettingsSchema);