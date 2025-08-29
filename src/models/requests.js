import mongoose from "mongoose";
// const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  name: String,
  email: String,
  shopwareDevelopment: Boolean,
  updatesMaintenance: Boolean,
  customPluginDevelopment: Boolean,
  themeDevelopment: Boolean,
  other: Boolean,
  projectDescription: String,
  budget: Number,
  time: { type: Date, default: Date.now },
});

export default mongoose.model("Request", RequestSchema);
