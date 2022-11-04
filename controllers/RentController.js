const { PrismaClient } = require("@prisma/client");
const { rentPrice } = require("../helpers/rentPrice");
const prisma = new PrismaClient();

const rentMovie = (req, res, next) => {
  const { code } = req.params;

  prisma.movies.findUnique({ where: { code: code } }).then((rental) => {
    if (!rental) throw new Error(" Movie Not Found ");
    if (rental.stock === 0) {
      return res.status(400).json({ error: "BAD REQUEST" });
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
};

//Funcion agregar un 10% del precio original por cada dia de tardanza
const lateRefund = async (originalPrice, daysLate) => {
  let finalPrice = originalPrice;

  for (let i = 0; i < daysLate; i++) {
    finalPrice += finalPrice * 0.1;
  }

  return finalPrice;
};
const rentsByUser = async (req, res, next) => {

  try {
    return prisma.rents
      .findMany({ where: { id_user: req.user.id } })
      .then((data) => {
        data
          ? res.status(201).send(data)
          : res.status(404).send("Movie Not Found");
      });
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

    if (!rent) return res.status(404).json({ errorMessage: "Rent not found" });

    rent.userRefund_date = new Date();

    const movie = await prisma.movies.findUnique({
      where: {
        code: rent.code,
      },
    });

    movie.stock++
    
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
    await prisma.rents.delete( {where: { id_rent: id} } )
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
  returnRent
};
