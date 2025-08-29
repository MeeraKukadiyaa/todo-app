import mongoose from "mongoose";
// const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  time: { type: Date, default: Date.now },
});

export default mongoose.model("Message", MessageSchema);
