const endpointsJson = require("../endpoints.json");
const request = require ("supertest");
const app = require ("../app");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
require("jest-sorted");

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
        expect(body.topics).toBeInstanceOf(Array);
        expect(body.topics).toHaveLength(3);
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

describe("GET /api/articles", () => {
  test("200: responds with array of articles, sorted by date in descending order", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body }) => {
      const { articles } = body;
      expect(articles).toBeInstanceOf(Array);
      expect(articles).toHaveLength(13);
      articles.forEach((article) => {
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
         });
         expect(article).not.toHaveProperty("body");
      });
      expect(articles).toBeSortedBy("created_at", { descending: true });
    });
  });
  test("404: responds reellevant response for invalid path", () => {
    return request(app)
    .get("/api/articleeeee")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Not Found");
    });
    });
  });

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with an array of comments for the given article_id", () => {
    return request (app)
    .get ("/api/articles/1/comments")
    .expect(200)
    .then(({ body }) => {
      const { comments } = body;
      expect(comments).toBeInstanceOf(Array);
      comments.forEach((comment) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          article_id: 1
        });
      });
      expect(comments).toBeSortedBy("created_at", { descending: true });
    });
  });
  test("200: responds with empty array when article has no comments", () => {
    return request (app)
    .get("/api/articles/2/comments")
    .expect(200)
    .then(({ body}) => {
      const { comments } = body;
      expect(comments).toEqual([]);
    })
  })
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a mew comment"
    };
    return request(app)
    .post("/api/articles/1/comments")
    .send(newComment)
    .expect(201)
    .then(({ body }) => {
      const { comment } = body;
      expect(comment.body).toBe("This is a mew comment")
      expect(comment.author).toBe("butter_bridge")
    })
  });
  test("404: responds with error when article does not exist", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a mew comment"
    };
    return request(app)
    .post("/api/articles/5656/comments")
    .send(newComment)
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Article not found")
    })
  });
  test("400: responds with error when missing required fields", () => {
    const newComment = {
      username: "butter_bridge",

    };
    return request(app)
    .post("/api/articles/1/comments")
    .send(newComment)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Missing required fields")
    });
  });

})