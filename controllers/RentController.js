const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()

const rentMovie = (req, res, next) => {
    
    const { code } = req.params;
    
    prisma.movies.findUnique({ where: { code: code, stock: { gt:0 } } })
    .then(rental => {
            if (!rental) throw new Error(' Missing stock ')
            prisma.rents.create({
                MovieCode: rental.code,
                id_user: req.user.id,
                rent_date:new Date(Date.now()),
                refund_date: new Date(Date.now() + (3600 * 1000 * 24) * 7),
            }).then(data => {
                prisma.movies.update({ stock: rental.stock - 1, rentals: rental.rentals + 1 }, { where: { code: rental.code } })
                    .then(() => res.status(201).send(data))
            })
        
        })
}

//Funcion agregar un 10% del precio original por cada dia de tardanza
const lateRefund = async (originalPrice, daysLate) => {
    let finalPrice = originalPrice;

    for (let i = 0; i < daysLate; i++) {
        finalPrice += finalPrice * 0.1
    };

    return finalPrice;
}
const rentsByUser = async (req, res, next) => {

    const rentByUsers = await prisma.rents.findUnique({ where: { id_user: req.user.id } })

    // return rentByUsers
    // console.log(rentByUsers);

    res.status(200).send(rentByUsers);
}
module.exports = {
    rentMovie,
    rentsByUser
}