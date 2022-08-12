const PORT = process.env.PORT || 5000;

const express = require("express");
const app = express();
require("dotenv").config();
require("express-async-errors");

//middleware
app.use(express.json());

//routes
app.get("/", (req, res) => {
  res.send('<h1>Products</h1><a href="/api/v1/products">Products</a>');
});

const productsRouter = require("./routes/products");
app.use("/api/v1/products", productsRouter);

const notFoundMiddleware = require("./middleware/not-found");
app.use(notFoundMiddleware);

const errorMiddleware = require("./middleware/error-handler");
app.use(errorMiddleware);

const connectDB = require("./db/connect");
const DB_URI = process.env.MONGO_URI;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`server running on port ${PORT}`));
  } catch (err) {
    console.log(err);
  }
};

start();
