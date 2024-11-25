const endpointsJson = require("../endpoints.json");
const request = require ("supertest");
const app = require ("../app");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data");

beforeEach(() => {
  return seed (testData);
});

afterAll(() => {
  return db.end();
})

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of objects including slug and description", () => {
    return request(app)
    .get ("/api/topics")
    .expect(200)
    .then(({ body }) => {
      console.log(body);      
      body.topics.forEach((topic) => {
        expect(topic).toMatchObject({
          slug: expect.any(String),
          description: expect.any(String),
        });
      })
    })
  })
});
