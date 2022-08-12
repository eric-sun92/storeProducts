const { query } = require("express");
const Product = require("../models/Product");

const getAllProducts = async (req, res) => {
  const { featured, name, company, sort, fields, numberFields } = req.query;

  const queryObject = {};

  if (featured != null) {
    queryObject.featured = featured;
  }

  if (name != null) {
    queryObject.name = new RegExp(name, "i");
  }

  if (company != null) {
    queryObject.company = new RegExp(company, "i");
  }
  let fieldList;
  if (fields != null) {
    fieldList = fields.split(",").join(" ");
  }

  //sort
  let sortList;
  if (sort != null) {
    sortList = sort.split(",").join(" ");
  }

  //pagination
  let limit = req.query.limit || 10;
  let page = req.query.page || 1;
  let skip = (page - 1) * limit;

  //number fields

  if (numberFields != null) {
    let temp = numberFields;
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };

    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    console.log(temp);
    let filters = temp.replace(regEx, (match) => {
      return `-${operatorMap[match]}-`;
    });
    //numberFields = price > 30
    //numberFields = price-$gt-30
    console.log(filters);
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      let [name, operator, number] = item.split("-");
      if (options.includes(name)) {
        queryObject[name] = { [operator]: Number(number) };
      }
    });
    console.log(queryObject);

    //numberFields = price > 30
    //{numberFields : {{price : $gt 30}}
  }

  const products = await Product.find(queryObject)
    .sort(sortList)
    .limit(limit)
    .skip(skip)
    .select(fieldList);

  res.json({ products, count: products.length });
};

module.exports = { getAllProducts };
