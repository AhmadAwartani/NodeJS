const express = require("express");
const router = express.Router();

const Glasses = require("../models/glassesModel");
const Lens = require("../models/lensModel");
const Frame = require("../models/frameModel");

// Get active frames
router.get("/frames", async (req, res) => {
  try {
    const activeFrames = await Frame.find({ status: "active" });
    res.status(201).json({
      status: "success",
      result: activeFrames.length,
      data: {
        activeFrames,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all lenses
router.get("/lenses", async (req, res) => {
  try {
    const lens = await Lens.find({});
    res.status(201).json({
      status: "success",
      result: lens.length,
      data: {
        lens,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create custom glasses// Create custom glasses// Create custom glasses
// Create custom glasses
router.post("/glasses", async (req, res) => {
  try {
    const { frameId, lensId, userId, currency } = req.body;

    let frame, lens;

    // If frameId is provided, check if the frame is available and has stock
    if (frameId) {
      frame = await Frame.findById(frameId);
      // If the frame is not found or has stock less than 1, find another active frame
      if (!frame || frame.stock < 1) {
        const activeFrames = await Frame.find({
          status: "active",
          stock: { $gt: 0 }, // Find frames with stock greater than 0
          _id: { $ne: frameId }, // Exclude the frame with the provided frameId
        });
        if (activeFrames.length === 0) {
          return res
            .status(400)
            .json({ message: "No active frames available" });
        }
        // Select a random frame from the available active frames
        const randomFrameIndex = Math.floor(
          Math.random() * activeFrames.length
        );
        frame = activeFrames[randomFrameIndex];
      }
    }

    // Check if the requested lens is available, otherwise get a random lens
    if (lensId) {
      lens = await Lens.findById(lensId);
      if (!lens || lens.stock < 1) {
        const activeLenses = await Lens.find({ stock: { $gt: 0 } });
        const randomLensIndex = Math.floor(Math.random() * activeLenses.length);
        lens = activeLenses[randomLensIndex];
      }
    }

    // Calculate price based on user's currency
    const framePrice = frame.price.find(
      (price) => price.currency === currency
    )?.value;
    const lensPrice = lens.price.find(
      (price) => price.currency === currency
    )?.value;

    if (!framePrice || !lensPrice) {
      return res
        .status(400)
        .json({ message: "Price not available for selected currency" });
    }

    const totalPrice = framePrice + lensPrice;

    // Deduct stock count of frame and lens
    frame.stock--;
    lens.stock--;

    await Promise.all([frame.save(), lens.save()]);

    // Store glasses in user's shopping basket
    const newGlasses = new Glasses({
      frame: frame._id,
      lens: lens._id,
      user: userId,
      price: totalPrice,
      currency,
    });

    await newGlasses.save();

    res
      .status(201)
      .json({ message: "Glasses created successfully", glasses: newGlasses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
