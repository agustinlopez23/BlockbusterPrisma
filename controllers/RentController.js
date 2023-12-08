const { PrismaClient } = require("@prisma/client");
const prismaError = require("../helpers/errorsPrisma");

const { rentPrice } = require("../helpers/rentPrice");
const prisma = new PrismaClient();

const getAllRents = async (req, res) => {
  try {
    let { order } = req.query;

    order ? (order = order) : (order = "asc");

    let rents = await prisma.rents.findMany();

    if (order === "asc") {

      rents.sort((a, b) => a.id_rent - b.id_rent)

    } else if (order === "desc") {

      rents.sort((a, b) => b.id_rent - a.id_rent)
    }

    rents.length > 0
      ? res.status(200).json(rents)
      : res.status(404).json({ errorMessage: "Rent not found" });

  } catch (error) {
    console.log(error);
    const { name } = error;
    const errorMessage = prismaError[name] || "Internal server error";
    res.status(500).json({ errorMessage });
  }
};
const rentMovie = (req, res, next) => {
  try {
    const { code } = req.params;

    prisma.movies.findUnique({ where: { code: code } }).then((rental) => {
      if (!rental) return res.status(400).json({ message: "Movie Not Found" });
      if (rental.stock === 0) {
        return res.status(200).json({ error: "That movie not have stock" });
      }
      prisma.rents
        .create({
          data: {
            code: rental.code,
            id_user: req.user.id,
            rent_date: new Date(Date.now()),
            refund_date: new Date(Date.now() + 3600 * 1000 * 24 * 7),
          },
        })
        .then((data) => {
          prisma.movies
            .update({
              data: { stock: rental.stock - 1, rentals: rental.rentals + 1 },
              where: { code: rental.code },
            })
            .then(() => res.status(201).send(data));
        });
    });
  } catch (error) {
    const { name } = error;
    const errorMessage = prismaError[name] || "Internal server error";
    res.status(500).json({ errorMessage });
  }

};

//Function to add 10% of the original price for each day late.
const lateRefund = async (originalPrice, daysLate) => {
  let finalPrice = originalPrice;

  for (let i = 0; i < daysLate; i++) {
    finalPrice += finalPrice * 0.1;
  }

  return finalPrice;
};
const rentsByUser = async (req, res, next) => {
  try {
    let { order } = req.query;

    order ? (order = order) : (order = "asc");
    let allHistoryRent = await prisma.rents
      .findMany({ where: { id_user: req.user.id } })
    //Aca deberia filtrar las tienen userRefund_date en null y mostrarlas
    let rentsbyuser = allHistoryRent.filter(rent => rent.userRefund_date === null)

    if (order === "asc") {
      rentsbyuser.sort((a, b) => a.rent_date - b.rent_date)
    } else if (order === "desc") {
      rentsbyuser.sort((a, b) => b.rent_date - a.rent_date)
    }
    rentsbyuser.length > 0
      ? res.status(200).json(rentsbyuser)
      : res.status(200).json({ message: "Movies not found" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Service unavailable");
  }
};

const returnRent = async (req, res) => {
  try {
    let { id } = req.params;
    id = parseInt(id);

    const rent = await prisma.rents.findUnique({
      where: {
        id_rent: id,
      },
    });

    if (!rent) return res.status(200).json({ message: "Rent not found" });

    rent.userRefund_date = new Date();

    const movie = await prisma.movies.findUnique({
      where: {
        code: rent.code,
      },
    });

    movie.stock++;

    await prisma.movies.update({
      where: {
        code: movie.code,
      },
      data: {
        stock: movie.stock,
      },
    });

    await prisma.rents.update({
      where: {
        id_rent: id,
      },
      data: {
        userRefund_date: rent.userRefund_date,
      },
    });

    res.status(200).json({
      message: "The movie was returned",
      price: rentPrice(rent.userRefund_date, rent.refund_date),
    });
    //await prisma.rents.delete({ where: { id_rent: id } });
  } catch (error) {
    console.log(error);

    const { name } = error;

    const errorMessage = prismaError[name] || "Internal server error";
    res.status(500).json({ errorMessage });
  }
};
module.exports = {
  rentMovie,
  rentsByUser,
  returnRent,
  getAllRents
};
