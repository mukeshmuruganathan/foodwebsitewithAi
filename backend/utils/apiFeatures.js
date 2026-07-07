class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // Search by keyword
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword.trim(),
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find(keyword);
    return this;
  }

  // Filter by price, ratings, etc.
  filter() {
    const queryCopy = { ...this.queryStr };

    // Remove fields that are not filters
    const removeFields = ["keyword", "page", "limit", "sortBy"];
    removeFields.forEach((field) => delete queryCopy[field]);

    // Convert query operators to MongoDB operators
    let queryStr = JSON.stringify(queryCopy);

    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  // Sorting
  sort() {
    let sortQuery = { createdAt: -1 }; // Default: Latest first

    if (this.queryStr.sortBy) {
      const sortBy = this.queryStr.sortBy.toLowerCase();

      switch (sortBy) {
        case "ratings":
          sortQuery = { ratings: -1 };
          break;

        case "reviews":
          sortQuery = { numOfReviews: -1 };
          break;

        case "price-low":
          sortQuery = { price: 1 };
          break;

        case "price-high":
          sortQuery = { price: -1 };
          break;

        case "latest":
          sortQuery = { createdAt: -1 };
          break;

        case "oldest":
          sortQuery = { createdAt: 1 };
          break;

        case "name":
          sortQuery = { name: 1 };
          break;

        default:
          sortQuery = { createdAt: -1 };
      }
    }

    this.query = this.query.sort(sortQuery);

    return this;
  }

  // Pagination
  pagination(resPerPage) {
    const currentPage = Math.max(Number(this.queryStr.page) || 1, 1);

    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.skip(skip).limit(resPerPage);

    return this;
  }
}

module.exports = APIFeatures;