function getPagination(query) {
  const page = Math.max(Number.parseInt(query.page || "1", 10), 1);
  const limit = Math.min(
    Math.max(Number.parseInt(query.limit || "12", 10), 1),
    100
  );
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
}

function buildPaginationMeta({ total, page, limit }) {
  const totalPages = Math.ceil(total / limit) || 1;

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

module.exports = {
  getPagination,
  buildPaginationMeta,
};
