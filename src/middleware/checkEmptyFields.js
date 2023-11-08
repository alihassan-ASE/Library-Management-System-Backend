function isEmpty(body) {
  for (const key in body) {
    if (typeof body[key] === "string" && body[key].trim() === "") {
      return true;
    }
  }
  return false;
}

module.exports = isEmpty;
