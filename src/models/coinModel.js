const mongoose = require("mongoose");

const coinSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
    },
    symbol: {
      type: String,
      required: [true, "Please add an symbol"],
      unique: true,
    },
    price: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Coin", coinSchema);
