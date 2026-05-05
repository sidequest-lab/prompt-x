function pick(source, keys) {
  return keys.reduce((result, key) => {
    if (typeof source[key] !== "undefined") {
      result[key] = source[key];
    }

    return result;
  }, {});
}

module.exports = pick;
