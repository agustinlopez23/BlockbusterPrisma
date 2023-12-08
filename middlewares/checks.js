const jwt = require("jsonwebtoken");

const checkLoggedIn = (req, res, next) => {
  if (!req.headers.authorization) { return res.status(401).json({ message: "You must put your credentials" }) }

  const token = req.headers.authorization.split(" ")[1];
  let decoded = jwt.decode(token, { complete: true });
  if (!decoded) {
    const e = new Error("Forbidden");
    next(e);
  } else {
    next();
  }
};

const checkAdmin = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  let decoded = jwt.decode(token, { complete: true });
  if (!decoded || decoded.payload.usuario.role !== "ADMIN") {
    const e = new Error("Forbidden");
    next(e);
  } else {
    next();
  }
};

const checkLoggedUser = (req, res, next) => {
  if (!req.headers.authorization) return res.status(401).json({ message: "Unauthorized" })
  const token = req.headers.authorization.split(" ")[1];
  let decoded = jwt.decode(token, { complete: true });
  if (!decoded) {
    const e = new Error("Forbidden");
    next();
  } else {
    req.user = decoded.payload.usuario;
    console.log(req.user);
    next();
  }
};

module.exports = {
  checkAdmin,
  checkLoggedIn,
  checkLoggedUser,
};
