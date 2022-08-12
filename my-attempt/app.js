const express = require("express");
const app = express();
require("dotenv").config();
require("express-async-errors");

app.use(express.json());

app.get("/", (req, res) => {
  res.send('<h1> Products </h1> <a href="/api/v1/products"> Products </a>');
});

const productsRouter = require("./routes/products");
app.use("/api/v1/products", productsRouter);

const notFound = require("./middleware/notFound");
app.use(notFound);

const errorHandlerMiddleware = require("./middleware/error-handler");
app.use(errorHandlerMiddleware);

const connectDB = require("./db/connect");

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log("server running"));
  } catch (err) {
    console.log(err);
  }
};

start();
