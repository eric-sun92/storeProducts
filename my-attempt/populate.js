const jsonProducts = require("./products.json");
const Product = require("./models/Product");
require("dotenv").config();
const connectDB = require("./db/connect");

const populate = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Product.deleteMany();
    await Product.create(jsonProducts);
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

populate();
