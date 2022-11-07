const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prismaError = require("../helpers/errorsPrisma");
const prisma = new PrismaClient();
const login = (req, res, next) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      res.status(400)
          .json({ errorMessage: "All Fields need to be completed" });
    } else {
      let { email, password } = req.body;
      prisma.user
        .findUnique({ where: { email: email } })
        .then((usuarioDB) => {
          if (!usuarioDB) {
            return res.status(400).json({
              ok: false,
              err: {
                message: "Usuario o contraseña incorrectos",
              },
            });
          }
          // Validates that the password typed by the user is the one stored in the db.
          if (!bcrypt.compareSync(password, usuarioDB.password)) {
            return res.status(400).json({
              ok: false,
              err: {
                message: "Usuario o contraseña incorrectos",
              },
            });
          }
          // Generate authentication token
          let token = jwt.sign(
            {
              usuario: usuarioDB,
            },
            process.env.SEED_AUTENTICACION,
            {
              expiresIn: process.env.CADUCIDAD_TOKEN,
            }
          );
          res.json({
            ok: true,
            usuario: usuarioDB,
            token,
          });
        })
        .catch((error) => next(error));
    }
  } catch (error) {
    const { name } = error;
    const errorMessage = prismaError[name] || "Internal server error";
    res.status(500).json({ errorMessage });
  }
};

const register = async (req, res, next) => {
  try {
    let { email, password, dni, phone } = req.body;

    if (!email || !password || !dni || !phone) {
      res.send.json({
        status: "error",
        error: "All fields must be completed",
      });
    } else {
      const verifyUser = await prisma.user.findMany({
        where: {
          email: email,
          dni: dni,
          phone: phone,
        },
      });
      if (verifyUser.length > 0)
        return res.status(400)
          .json({ errorMessage: "Email, dni or phone is already in use" });
      let usuario = {
        email,
        dni,
        phone,
        password: bcrypt.hashSync(password, 10),
      };

      prisma.user.create({ data: usuario }).then((usuarioDB) => {
        return res
          .status(201)
          .json({
            ok: true,
            usuario: usuarioDB,
          })
          .end();
      });
    }
  } catch (error) {
    res.status(404).json({ status: "404", error: "Bad request, try again" });
  }
};

const logout = (req, res, next) => {
  try {
    req.user = null;
    console.log("LoguedOut");
    res.redirect("/login");
  } catch (error) {
    const { name } = error;
    const errorMessage = prismaError[name] || "Internal server error";
    res.status(500).json({ errorMessage });
  }
};
module.exports = {
  login,
  register,
  logout,
};
