const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({ featured: true });
  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};
  if (featured != null) {
    queryObject.featured = featured;
  }
  if (company != null) {
    queryObject.company = company;
  }
  if (name != null) {
    queryObject.name = new RegExp(name, "i");
  }
  let sortList;
  if (sort != null) {
    sortList = sort.split(",").join(" ");
  }
  let fieldList;
  if (fields != null) {
    fieldList = fields.split(",").join(" ");
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  if (numericFilters != null) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    console.log(numericFilters);
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    console.log(filters);
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }
  console.log(queryObject);

  const products = await Product.find(queryObject)
    .sort(sortList || "createdAt")
    .select(fieldList)
    .limit(limit)
    .skip(skip);

  // let result = Product.find(queryObject);
  // if (sort != null) {
  //   const sortList = sort.split(",").join(" ");
  //   result = result.sort(sortList);
  // } else {
  //   result = result.sort("createdAt");
  // }
  // const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = { getAllProducts, getAllProductsStatic };
