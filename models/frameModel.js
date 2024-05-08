const mongoose = require("mongoose");

const FrameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  stock: { type: Number, required: true },
  price: [
    {
      currency: {
        type: String,
        enum: ["USD", "GBP", "EUR", "JOD", "JPY"],
        required: [
          true,
          "The curreny should be in capital letter and one of these currencies 'USD', 'GBP', 'EUR', 'JOD', 'JPY' ",
        ],
      },
      value: { type: Number, required: true },
    },
  ],
});

const Frame = mongoose.model("Frame", FrameSchema);

module.exports = Frame;
