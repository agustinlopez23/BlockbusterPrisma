const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const login = (req, res, next) => {
  let body = req.body;
  prisma.user
    .findUnique({ where: { email: body.email } })
    .then((usuarioDB) => {
      if (!usuarioDB) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "Usuario o contraseña incorrectos",
          },
        });
      }
      // Valida que la contraseña escrita por el usuario, sea la almacenada en la db
      if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "Usuario o contraseña incorrectos",
          },
        });
      }
      // Genera el token de autenticación
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
};

const register = (req, res, next) => {
  try {
    let { email, password, dni, phone } = req.body;
  if (!email || !password || !dni || !phone) {
    res.send.json({
      status: "error",
      error: "All fields must be completed",
    });
  } else {
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
    res.status(404).json({status:"404", error:"Bad request, try again"})
  }
  
};

const logout = (req, res, next) => {
  req.user = null;
  console.log("LoguedOut");
  res.redirect("/login");
};
module.exports = {
  login,
  register,
  logout,
};
