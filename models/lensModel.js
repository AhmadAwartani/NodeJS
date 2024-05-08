const mongoose = require("mongoose");

const LensSchema = new mongoose.Schema({
    colour: { type: String, required: true },
    description: { type: String, required: true },
    prescription_type: { type: String, enum: ['fashion', 'single_vision', 'varifocal'], required: true },
    lens_type: { type: String, enum: ['classic', 'blue_light', 'transition'], required: true },
    stock: { type: Number, required: true },
    price: [{
        currency: { type: String, enum: ['USD', 'GBP', 'EUR', 'JOD', 'JPY'], required: true },
        value: { type: Number, required: true }
    }]
});

const Lens = mongoose.model('Lens', LensSchema);

module.exports = Lens;