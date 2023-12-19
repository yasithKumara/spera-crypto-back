const chai = require("chai");
const supertest = require("supertest");
const app = require("../../src/app"); // Import your Express app
const mongoose = require("mongoose");
const { expect } = chai;

// Wrap your tests in a describe block
describe("/auth route", () => {
  let server;

  // Use a "before" hook to wait till server connect to database
  before(async () => {
    setTimeout(() => {}, 3000);
  });

  it("should register a new user successfully", async () => {
    const userData = {
      name: "testuser",
      email: "testuser@gmail.com",
      password: "testpassword",
    };

    const response = await supertest(app).post("/auth/register").send(userData);

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property("_id");
    expect(response.body).to.have.property("name");
    expect(response.body).to.have.property("email");
  });

  it("should fail to register a user with duplicate username", async () => {
    const userData = {
      name: "testuserduplicate",
      email: "testuserduplicate@gmail.com",
      password: "testpassword",
    };

    // Register the user once
    await supertest(app).post("/auth/register").send(userData);

    // Attempt to register the same user again
    const response = await supertest(app).post("/auth/register").send(userData);

    expect(response.status).to.equal(400); // Assuming you return a 400 Bad Request for duplicate username
    expect(response.body).to.have.property("error");
  });

  it("should fail to register a user with invalid data", async () => {
    const invalidUserData = { password: "testpassword" }; // Missing email and name

    const response = await supertest(app)
      .post("/auth/register")
      .send(invalidUserData);

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property("error");
  });

  it("should log in a user successfully", async () => {
    const userData = { email: "testuser@gmail.com", password: "testpassword" };

    // Register the user first
    await supertest(app).post("/auth/register").send(userData);

    // Log in the registered user
    const response = await supertest(app).post("/auth/login").send(userData);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("token");
  });

  it("should fail to log in with incorrect password", async () => {
    const userData = { email: "testuser@gmail.com", password: "testpassword" };

    // Register the user first
    await supertest(app).post("/auth/register").send(userData);

    // Attempt to log in with incorrect password
    const incorrectPasswordData = {
      email: "testuser@gmail.com",
      password: "wrongpassword",
    };
    const response = await supertest(app)
      .post("/auth/login")
      .send(incorrectPasswordData);

    expect(response.status).to.equal(400); // Assuming you return a 401 Unauthorized for incorrect password
    expect(response.body).to.have.property("error");
  });

  it("should fail to log in with nonexistent username", async () => {
    const nonexistentUserData = {
      email: "nonexistantemail@gmail.com",
      password: "somepassword",
    };

    // Attempt to log in with nonexistent username
    const response = await supertest(app)
      .post("/auth/login")
      .send(nonexistentUserData);

    expect(response.status).to.equal(400); // Assuming you return a 401 Unauthorized for nonexistent username
    expect(response.body).to.have.property("error");
  });

  it("should fail to log in with invalid data", async () => {
    const invalidLoginData = { password: "testpassword" }; // Missing username

    const response = await supertest(app)
      .post("/auth/login")
      .send(invalidLoginData);

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property("error");
  });
});
