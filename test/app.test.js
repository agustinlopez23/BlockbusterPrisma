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
const token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7ImlkIjoyNiwiZW1haWwiOiJjcmlzdGlhbkBnbWFpbC5jb20iLCJkbmkiOiI0MzEyMzQ1MyIsInBob25lIjoiNTU1LTU1NS01NTUiLCJwYXNzd29yZCI6IiQyYiQxMCRzSDJZeFFaZmt6ajljRGljMkluWE9lTFFZLlJ1eEN3d2tTNnBhYW1iYVZhNzBjNFdpYUhraSIsInVwZGF0ZWRBdCI6IjIwMjItMTEtMDdUMDQ6MjI6NDkuMjc0WiIsImNyZWF0ZWRBdCI6IjIwMjItMTEtMDdUMDQ6MjI6NDkuMjc0WiIsInJvbGUiOiJVU0VSIn0sImlhdCI6MTY2Nzc5NTMyMCwiZXhwIjoyMDAwMDAwMDAwfQ.Sf_JuTLixF8pXx-fpUZlPnVt2ywbiWxKdVwL4Jb_B0c";
const bcrypt = require("bcrypt");

// beforeEach(() => {
//   prisma.user.delete()
//   prisma.rents.delete()
//   prisma.movies.delete()
//   prisma.favoriteFilms.delete()

// });

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
