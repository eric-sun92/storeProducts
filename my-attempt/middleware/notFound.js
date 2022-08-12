const notFound = (req, res, next) => {
  res.status(404).send("Route Doesn't Exist");
};

module.exports = notFound;
