const { Users } = require("../../models");

function registration(user) {
  return Users.create(user);
}

function login(body) {
  const email = body.email;
  return Users.findOne({ where: { email } });
}

module.exports = {
  registration,
  login,
};
