const express = require("express");
const router = express.Router();

const Lens = require("../models/lensModel");
const Frame = require("../models/frameModel");


//Create new frame
router.post("/frame", async (req, res) => {
  const newFrame = await Frame.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      newFrame,
    },
  });
});

//Create new lens
router.post("/lens", async (req, res) => {
  try {
    const newLens = await Lens.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        newLens,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
