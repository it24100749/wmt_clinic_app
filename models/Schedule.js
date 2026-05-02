const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: String,
  startTime: String,
  endTime: String,

  consultationFee: {
    type: Number,
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Schedule", scheduleSchema);