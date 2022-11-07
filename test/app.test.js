const { expect } = require("chai");
const { response } = require("express");
const request = require("supertest");
const assert = require("chai").assert;
const { app } = require("../app");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const MovieController = require("../controllers/MovieController");
const RentController = require("../controllers/RentController");
const UserController = require("../controllers/UserController");
const FavoriteController = require("../controllers/FavoritesController");

const bcrypt = require("bcrypt");

// beforeEach(() => {
//   prisma.user.delete()
//   prisma.rents.delete()
//   prisma.movies.delete()
//   prisma.favoriteFilms.delete()

// });
// const userExample = {
//   email: "cristian@gmail.com",
//   password: "avalith",
//   phone: "555-555-555",
//   dni: "43123453",
// };
// const movieExample = {
//   codeExample: "2baf70d1-42bb-4437-b551-e5fed5a87abe",
//   codeExample2: "0440483e-ca0e-4120-8c50-4c8cd9b965d6",
//   title: "Castle in the Sky",
//   stock: "5",
//   rentals: "0",
//   review: "Colocar Review"
// }
describe("POST /register", () => {
  const userExample = {
    email: "cristian@gmail.com",
    password: "avalith",
    phone: "555-555-555",
    dni: "43123453",
  };

  it("should user register", (done) => {
    request(app)
      .post("/register")
      .send(userExample)
      .expect(201)
      .then(async (response) => {
        assert.isTrue(response._body.ok);
        assert.isNotEmpty(response._body);
        assert.isNotArray(response._body);
        assert.containsAllKeys(response._body.usuario, [
          "email",
          "password",
          "phone",
          "dni",
          "createdAt",
          "updatedAt",
        ]);
        const userDB = await prisma.user.findUnique({
          where: { email: userExample.email },
        });
        assert.exists(userDB);
        assert.isTrue(
          bcrypt.compareSync(
            userExample.password,
            response._body.usuario.password
          )
        );
      })
      .then(() => done(), done);
  });

  it("Should not allowed user to register twice", (done) => {
    request(app)
      .post("/register")
      .send(userExample)
      .expect(400)
      .then((response) => {
        assert.isNotNull(
          response._body.errorMessage,
          "Email, dni or phone is already in use"
        );
        assert.isNotEmpty(response._body);
      })
      .then(() => done(), done);
  });
  it("Should logued in", (done) => {
    request(app)
      .post("/login")
      .send({
        email: "cristian@gmail.com",
        password: "avalith",
      })
      .expect(200)
      .then((response) => {
        assert.isNotNull(response._body.ok);
        assert.isNotEmpty(response._body);
      })
      .then(() => done(), done);
  });
  it("Should logued out", (done) => {
    request(app)
      .post("/login")
      .send({
        email: "cristian@gmail.com",
        password: "avalith",
      })
      .expect(200)
      .then((user) => {
        request(app)
          .post("/logout")
          .set({
            Authorization: `Bearer ${user._body.token}`,
          })
          .expect(200);
      })
      .then(() => done(), done);
  });
});
describe("POST /rent/:code", () => {
  // beforeEach(done => {
  // })

  const userExample = {
    email: "cristian@gmail.com",
    password: "avalith",
  };
  const movieExample = {
    codeExample: "2baf70d1-42bb-4437-b551-e5fed5a87abe",
    title: "Castle in the Sky",
    stock: "5",
    rentals: "0",
    review: "Colocar Review",
  };

  it("Should return 201 and successfully rent a movie", (done) => {
    request(app)
      .post("/login")
      .send({
        email: "cristian@gmail.com",
        password: "avalith",
      })
      .expect(200)
      .then((user) => {
        request(app)
          .post(`/rent/${movieExample.codeExample}`)
          .set({ Authorization: `Bearer ${user._body.token}` })
          .expect(201)
          .then(async (response) => {
            //console.log(response);
            assert.containsAllKeys(response._body.usuario, [
              "id_rent",
              "id_user",    
              "code",
              "rent_date",
              "refund_date",
              "userRefund_date",
              "updatedAt",
              "createdAt",
            ]);
            
          });
      })
      .then(() => done(), done);

    //TO_DO
    //Check status
    //Chequear si se persistio correctamente la reserva
    //Chequear que se quito una peli de stock
    //Chequear que se sumo la renta a las veces alquiladas
  });
  it("Should not allow rent if there is no stock", (done) => {
    //TO-DO
  });
  it("Should not allow rent if movie does not exist", (done) => {
   
    request(app)
      .post("/login")
      .send({
        email: "cristian@gmail.com",
        password: "avalith",
      })
      .expect(200)
      .then((user) => {
        request(app)
          .post(`/rent/codenotexits`)
          .set({ Authorization: `Bearer ${user._body.token}` })
          .expect(404)
          .then((response) => {
            console.log(response);
          });
      })
      .then(() => done(), done);
  });
  it("Should not allow non logged user to rent a movie", (done) => {
    //TO-DO
  });
});

describe("GET /movies", () => {
  it("Should return status 200", (done) => {
    request(app).get("/movies").expect(200).end(done);
  });

  it("Should return json", (done) => {
    request(app)
      .get("/movies")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(done);
  });

  it("Should return movies", (done) => {
    request(app)
      .get("/movies")
      .expect(200)
      .then((response) => {
        assert.isNotEmpty(response._body);
        assert.isArray(response._body);
        response._body.forEach((movie) =>
          assert.containsAllKeys(movie, [
            "title",
            "description",
            "director",
            "producer",
            "release_date",
            "running_time",
            "rt_score",
          ])
        );
      })
      .then(() => done(), done); // soluciona el problema de  Error: Timeout of 2000ms exceeded.
  });
});

describe("GET /movies/:id", () => {
  it("Get Movie Details By ID", (done) => {
    request(app)
      .get("/movies/58611129-2dbc-4a81-a72f-77ddfc1b1b49")
      .expect(200)
      .then((response) => {
        assert.isNotEmpty(response._body); //no esta vacio
        assert.isNotArray(response._body);
        assert.containsAllKeys(response._body, [
          "title",
          "description",
          "director",
          "producer",
          "release_date",
          "running_time",
          "rt_score",
        ]);
      })
      .then(() => done(), done);
  });
});
describe("GET /movies/title/:title", () => {
  it("Get Movie Details By title", (done) => {
    request(app)
      .get("/movies/58611129-2dbc-4a81-a72f-77ddfc1b1b49")
      .expect(200)
      .then((response) => {
        assert.isNotEmpty(response._body); //no esta vacio
        assert.isNotArray(response._body);
        assert.containsAllKeys(response._body, [
          "title",
          "description",
          "director",
          "producer",
          "release_date",
          "running_time",
          "rt_score",
        ]);
      })
      .then(() => done(), done);
  });
});
describe("Not Found handling", () => {
  it("Should return status 404", (done) => {
    request(app)
      .get("/")
      .expect(404)
      .then((response) => {
        assert.isNotEmpty(response.res);
        assert.equal(response.res.statusMessage, "Not Found");
      })
      .then(() => done(), done);
  });
});
