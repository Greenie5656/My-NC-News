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
  });
  test("404: responds with relevant response for an id that does not exist", () => {
    return request (app)
    .get("/api/articles/565656/comments")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Article not found");
    });
  });
  test("400: responds with a response for invalid id", () => {
    return request (app)
    .get("/api/articles/not-an-id/comments")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid article id");
    });
  });
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
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: responds with updated article when votes are added", () => {
    const voteUpdate = { inc_votes: 1};
    return request (app)
    .patch("/api/articles/1")
    .send(voteUpdate)
    .expect(200)
    .then(({ body }) => {
      const {article} = body;
      expect(article).toMatchObject({
        article_id: 1,
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String)
      });
      expect(article.votes).toBe(101);
    })
  })
  test("200: responds correctly when votes are decremented", () => {
    const voteUpdate = { inc_votes: -100 };
    return request(app)
    .patch("/api/articles/1")
    .send(voteUpdate)
    .expect(200)
    .then(({ body }) => {
      const {article} = body;
      expect(article.votes).toBe(0);
    });
  });
  test("404: responds with error when article does not exist", () => {
    const voteUpdate = { inc_votes: 1 };
    return request(app)
    .patch("/api/articles/5656")
    .send(voteUpdate)
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Article not found");
    });
  });
  test("400: responds with error when article_id is invalid", () => {
    const voteUpdate = { inc_votes: 1 };
    return request(app)
    .patch("/api/articles/not-an-id")
    .send(voteUpdate)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid article id");
    })
  })
  test("400: responds with error when empty", () => {
    const voteUpdate = {};
    return request(app)
    .patch("/api/articles/1")
    .send(voteUpdate)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Missing inc_votes in request body");
    });
  });
  test("400: responds with error when inc_votes is not a number", () => {
    const voteUpdate = { inc_votes: "not a number"};
    return request(app)
    .patch("/api/articles/1")
    .send(voteUpdate)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid inc_votes value")
    })
  })
})

describe("DELETE /api/comments/:comment_id", () => {
  test("204: deletes the comment", () => {
    return request(app)
    .delete("/api/comments/1")
    .expect(204)
    .then(({ body }) => {
      expect(body).toEqual({});
    });
  });
  test("404: responds with error when comment does not exist", () => {
    return request (app)
    .delete("/api/comments/5656")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Comment not found");
    })
  })
  test("400: responds with error when comment_id is invalid", () => {
    return request(app)
    .delete("/api/comments/not-a-comment")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid comment id");
    });
  });
})

describe("GET /api/users", () => {
  test("200: responds with an array of user objects", () => {
    return request (app)
    .get("/api/users")
    .expect(200)
    .then(({ body }) => {
      const { users } = body;
      expect(users).toBeInstanceOf(Array);
      expect(users.length).toBeGreaterThan(0);
      users.forEach((user) => {
        expect(user).toMatchObject({
        username: expect.any(String),
        name: expect.any(String),
        avatar_url: expect.any(String)
      });
    });
  });
});
  test("404: responds with error for wrong path", () => {
    return request(app)
    .get("/api/userss")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Not Found");
    });
  })
});

describe("GET /api/articles - sorting queries", () => {
  test("200: accepts sort_by query and sorts by any valid column", () => {
    return request(app)
    .get("/api/articles?sort_by=votes")
    .expect(200)
    .then(({ body }) => {
      const { articles } = body;
      expect(articles).toBeSortedBy("votes", { descending: true });
    });
  });
  test("200: takes query and sorts in specified direction", () => {
    return request(app)
    .get("/api/articles?order=asc")
    .expect(200)
    .then(({ body }) => {
      const { articles } = body;
      expect(articles).toBeSortedBy("created_at", { ascending: true });
    })
  });
  test("200: accepts both sort_by and order queries together", () => {
    return request(app)
    .get("/api/articles?sort_by=author&order=asc")
    .expect(200)
    .then(({ body }) => {
      const { articles } = body;
      expect(articles).toBeSortedBy("author", { ascending: true }); 
    });
  });
  test("200: uses defauults when no queries provided", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body }) => {
      const { articles } = body;
      expect(articles).toBeSortedBy("created_at", { descending: true });
    })
  })
  test("400: responds with error for invalid sort_by column", () => {
    return request(app)
    .get("/api/articles?sort_by=bananas")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid sort_by query");
    })
  });
  test("400: responds with error for invalid order value", () => {
    return request(app)
    .get("/api/articles?order=bananas")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid order query")
    })
  })
  test("200: handles case insesitive order values", () => {
    return request(app)
    .get("/api/articles?order=ASC")
    .expect(200)
    .then(({ body }) => {
      const { articles } = body;
      expect(articles).toBeSortedBy("created_at", { ascending: true });
    });
  });
});

describe("GET /api/articles - topic query", () => {
  test("200: filters articles ny the specified topic", () => {
    return request(app)
  .get("/api/articles?topic=cats")
  .expect(200)
  .then(({ body }) => {
    const { articles } = body;
    expect(articles).toHaveLength(1);
    articles.forEach((article) => {
      expect(article.topic).toBe("cats");
    });
  });
  });
  test("200: returns all articles when no topic is specified", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body }) => {
      const { articles } = body;
      expect(articles).toHaveLength(13);
    })
  })
  test("200: returns an empty array for a topic with no articles", () => {
    return request(app)
    .get("/api/articles?topic=paper")
    .expect(200)
    .then(({ body }) => {
      const { articles } = body;
      expect(articles).toEqual([]);
    })
  });
});

describe("GET /api/articles/:article_id - comment_count", () => {
  test("200: counts comments on a specified article_id", () => {
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({ body }) => {
      const { article } = body;
      expect(article.comment_count).toBe(11)
    })
  })
  test("200: article with no comments has zero count", () => {
    return request(app)
    .get("/api/articles/2")
    .expect(200)
    .then(({ body}) => {
      const { article } = body;
      expect(article.comment_count).toBe(0);
    })
  })
});

describe("GET /api/users/:username", () => {
  test("200: responds with a user object containing name, avatar_url and usewrname", () => {
    return request(app)
    .get("/api/users/butter_bridge")
    .expect(200)
    .then(({ body }) => {
      const { user } = body;
      expect(user).toMatchObject({
        username: "butter_bridge",
        avatar_url: expect.any(String),
        name: expect.any(String)

      })
    })
  })
  test("404: responds with msg when user does not exist", () => {
    return request(app)
    .get("/api/users/not_a_username")
    .expect(404)
    .then(({ body }) => {
      const { msg } = body;
      expect(msg).toBe("User not found");
    })
  })
})

describe("PATCH /api/comments/:comment_id", () => {
  test("200: responds with updated coment when votes are added", () => {
    return request(app)
    .patch("/api/comments/1")
    .send({ inc_votes: 1})
    .expect(200)
    .then(({ body}) => {
      const { comment } = body;
      expect(comment).toMatchObject({
        comment_id: 1,
        votes: expect.any(Number),
        author: expect.any(String),
        body:expect.any(String)
      });
      expect(comment.votes).toBe(17);
    });
  });
  test("200: responds with updated comment when votes are decremented", () => {
    return request(app)
    .patch("/api/comments/1")
    .send({ inc_votes: -1 })
    .expect(200)
    .then(({ body}) => {
      const { comment } =  body;
      expect(comment.votes).toBe(15);
    })
  });
  test("404: responds with error when comment does not exist", () => {
    return request(app)
    .patch("/api/comments/5656")
    .send({ inc_votes: 1 })
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Comment not found");
    })
  })
  test('400: responds with error when comment_id is invalid', () => {
    return request(app)
    .patch('/api/comments/not_an_id')
    .send({ inc_votes: 1 })
    .expect(400)
    .then(({ body }) => {
        expect(body.msg).toBe('Invalid comment id');
    });
});
})