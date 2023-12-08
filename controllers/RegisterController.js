const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


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
          .json({ status: "400", errorMessage: "Email, dni or phone is already in use" });
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


module.exports = {

  register

};
