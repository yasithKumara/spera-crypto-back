const chai = require('chai');
const supertest = require('supertest');
const app = require('../../src/app'); // Import your Express app
const mongoose = require('mongoose');
const { expect } = chai;


// Wrap your tests in a describe block
describe('GET /users', () => {
  let server;

  // Use a "before" hook to start the server and connect to the database
  before(async () => {
    // Start your server (you might want to use a testing port)
    server = app.listen(3000); // Adjust the port as needed

    //Connect to the database
    await mongoose.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

     setTimeout(()=>(console.log("first")), 2000 )
  });

  // Use a "after" hook to close the server and disconnect from the database
  after(async () => {
    // // Close the server
    // server.close();

    // // Disconnect from the database
    // await mongoose.disconnect();
  });

  // Your tests go here
  it('should return a list of users when authenticated', async () => {
    const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ODAyYzAzNWUxNGZmYmQwNGU5ZmI0MSIsImlhdCI6MTcwMjg5OTMyMCwiZXhwIjoxNzA1NDkxMzIwfQ.CUZRdnfZ9ANqa8EW2NI4d7ZhEbRhbxKcj4NL8GR0e60';
    const response = await supertest(app)
      .get('/users')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
  });

  it('should return an error when not authenticated', async () => {
    const response = await supertest(app).get('/users');

    expect(response.status).to.equal(401);
  });
});
