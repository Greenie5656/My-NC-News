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
          body.topics.forEach((topic) => {
        expect(topic).toMatchObject({
          slug: expect.any(String),
          description: expect.any(String),
        });
      })
    })
  })
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with object containing correct properties", () => {
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({ body: { article } }) => {
      expect(article).toMatchObject({
        author: expect.any(String),
        title: expect.any(String),
        article_id: 1,
        body: expect.any(String),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
      })
    })
  })
  test("404: resonds relevant response for an id that doesnt exist", () => {
    return request (app)
    .get("/api/articles/565656")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Article not found")
    })
  })
  test("400: responds with relevant response for an invalid id", () => {
    return request (app)
    .get("/api/articles/unknown")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid article id")
    })
  })
})
