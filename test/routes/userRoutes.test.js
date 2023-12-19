const chai = require("chai");
const supertest = require("supertest");
const app = require("../../src/app"); // Import your Express app
const mongoose = require("mongoose");
const { expect } = chai;

describe("GET /users", () => {
  let server;
  let authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1N2ViMTk2MGY2Yzk5NmRmZTQxZDNmYSIsImlhdCI6MTcwMzAxNTkyOCwiZXhwIjoxNzA1NjA3OTI4fQ.t_ccuilt03qDazN4KqIbBJouaobBLNI_mIA5MzLqaw8".trim();

  // Use a "before" hook to wait till server connect to database
  before(async () => {
    setTimeout(() => {}, 3000);
  });

  it("should return a list of users when authenticated", async () => {
    const response = await supertest(app)
      .get("/users")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");
  });

  it("should return an error when not authenticated", async () => {
    const response = await supertest(app).get("/users");

    expect(response.status).to.equal(401);
  });

  it("should return user details for a valid user ID when authenticated", async () => {
    // Assuming you have a user ID that exists in your database
    const existingUserId = "657eb1960f6c996dfe41d3fa";

    const response = await supertest(app)
      .get(`/users/${existingUserId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("object");
    expect(response.body).to.have.property("_id");
    expect(response.body).to.have.property("name");
    expect(response.body).to.have.property("email");
    expect(response.body).to.have.property("favorite_coins");
  });

  it("should return an error for an invalid user ID when authenticated", async () => {
    // Assuming you have an invalid user ID that does not exist in your database
    const invalidUserId = "657eb1960f6c996dedf1d3fa";

    const response = await supertest(app)
      .get(`/users/${invalidUserId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).to.equal(404); // Assuming you return a 404 Not Found for an invalid user ID
    expect(response.body).to.have.property("error");
  });

  it("should return an error when not authenticated", async () => {
    // Omitting the Authorization header to simulate an unauthenticated request
    const response = await supertest(app).get("/users/someUserId");

    expect(response.status).to.equal(401); // Assuming you return a 401 Unauthorized for unauthenticated requests
    expect(response.body).to.have.property("error");
  });

  it("should update favorite coins for a valid user ID when authenticated and authorized", async () => {
    // Assume you have an existing user ID and valid favorite coins
    const existingUserId = "657eb1960f6c996dfe41d3fa";
    const validFavoriteCoins = [
      "657da14a8b3b68f7fbcc6b85",
      "657e9931aab54a3ff74fb3a0",
    ];

    const response = await supertest(app)
      .patch(`/users/${existingUserId}/favorite-coins`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ favorite_coins: validFavoriteCoins });

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("object");
    expect(response.body).to.have.property("_id");
    expect(response.body).to.have.property("name");
    expect(response.body).to.have.property("email");
    expect(response.body).to.have.property("favorite_coins");

  });

  it("should return an error for an invalid user ID when authenticated", async () => {
    // Assume you have an invalid user ID and valid favorite coins
    const invalidUserId = "invalid_user_id";
    const validFavoriteCoins = [
      "657da14a8b3b68f7fbcc6b85",
      "657e9931aab54a3ff74fb3a0",
    ];

    const response = await supertest(app)
      .patch(`/users/${invalidUserId}/favorite-coins`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ favorite_coins: validFavoriteCoins });

    expect(response.status).to.equal(400); // Assuming you return a 400 Not Found for an invalid user ID
    expect(response.body).to.have.property("error");

  });

  it("should return an error for invalid favorite coins data when authenticated", async () => {
    // Assume you have a valid user ID and invalid favorite coins data
    const validUserId = "657eb1960f6c996dfe41d3fa";
    const invalidFavoriteCoins = { not_an_array: "invalid_data" };

    const response = await supertest(app)
      .patch(`/users/${validUserId}/favorite-coins`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ favorite_coins: invalidFavoriteCoins });

    expect(response.status).to.equal(400); // Assuming you return a 400 Bad Request for invalid data
    expect(response.body).to.have.property("error");

  });

  it("should return an error for an unauthenticated request", async () => {
    // Omitting the Authorization header to simulate an unauthenticated request
    const response = await supertest(app)
      .patch("/users/someUserId/favorite-coins")
      .send({ favorite_coins: ["coin_id_1", "coin_id_2"] });

    expect(response.status).to.equal(401); // Assuming you return a 401 Unauthorized for unauthenticated requests
    expect(response.body).to.have.property("error");

  });
});
