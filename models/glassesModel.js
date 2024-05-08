const mongoose = require("mongoose");

const GlassesSchema = new mongoose.Schema({
  frame: { type: mongoose.Schema.Types.ObjectId, ref: "Frame", required: true },
  lens: { type: mongoose.Schema.Types.ObjectId, ref: "Lens", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  price: { type: Number, required: true },
  currency: {
    type: String,
    enum: ["USD", "GBP", "EUR", "JOD", "JPY"],
    required: true,
  },
});

const Glasses = mongoose.model("Glasses", GlassesSchema);

module.exports = Glasses;
