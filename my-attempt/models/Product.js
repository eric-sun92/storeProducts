const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  featured: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: [true, "must provide name"],
  },
  company: {
    type: String,
    enum: {
      values: ["ikea", "liddy", "caressa", "marcos"],
      message: "{VALUE} is not supported",
    },
  },
  price: {
    type: Number,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Product", productSchema);
