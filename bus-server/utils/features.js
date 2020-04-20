class APIFeatures {
  constructor(query, queryString) {
    this.query = query; // this is the query object
    this.queryString = queryString;
  }
  filter() {
    let queryObject = { ...this.queryString };
    // filter
    const excludedFiled = ["page", "sort", "limit", "fields"];
    excludedFiled.forEach(el => delete queryObject[el]);

    // advanced filtering
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortfields = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortfields); // q uery chaining
    } else {
      this.query = this.query.sort("-createdAt"); // default - means descending
    }
    return this;
  }
  limitFIelds() {
    // limiting the documents  fields to be sent
    if (this.queryString.fields) {
      // the limit parameter can be an array
      const limitfields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(limitfields);
    } else {
      this.query = this.query.select("-__v"); // send all fields  except __v field
    }
    return this;
  }

  pagination() {
    // pagination: first skip prior pages then limit the number of pages in the response
    let pageLimit = this.queryString.limit * 1 || 10;
    let skip = (this.queryString.page * 1 - 1) * pageLimit || 0;
    this.query = this.query.skip(skip);
    this.query = this.query.limit(pageLimit);
    return this;
  }
}

module.exports = APIFeatures;
