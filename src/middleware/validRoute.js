function authorize(roles) {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (roles.includes(userRole.toLowerCase())) {
      next();
    } else {
      res.send({ message: "Feature only for Admins and Users" });
    }
  };
}

function isAdmin(req, res, next) {
  const role = req.user.role;
  if (role.toLowerCase() === "admin") {
    next();
  } else {
    res.send({
      message: "Your are Not Admin. This feature is only for Admins",
    });
  }
}

module.exports = {
  authorize,
  isAdmin,
};
