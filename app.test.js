const app = require("./app")
const db = require("./db/connection")
const seed = require("./db/seeds/seed")
const data = require("./db/data")
const request = require("supertest")

afterAll(() => db.end())
beforeEach(() => seed(data))

describe("/*", () => {
    test("status: 400 when passed endpoint that does not exist", () => {
        return request(app)
        .get("/test")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Endpoint not found")
        })
    })
})


describe("/api/topics", () => {
    describe("GET", () => {
        describe("Functionality", () => {
            test("status 200: responds with an array", () => {
                return request(app)
                .get("/api/topics")
                .expect(200)
                .then(({ body }) => {
                    const { topics } = body
                    expect(topics).toBeInstanceOf(Array)
                    expect(topics).toHaveLength(3)
                })
            })
            test("status 200: responds with topics data with correct keys and values data", () => {
                return request(app)
                .get("/api/topics")
                .expect(200)
                .then(({ body }) => {
                    const { topics } = body
                    topics.forEach((topic) => {
                        expect(topic).toEqual(
                            expect.objectContaining({
                                slug: expect.any(String),
                                description: expect.any(String)
                            })
                        )
                    })
                })
            })
        })
    })
})

describe("/api/articles/:article_id", () => {
    describe("GET", () => {
        describe("Functionality", () => {
            test("status:200 responds with relevant information about a chosen article (1)", () => {
                return request(app)
                .get("/api/articles/1")
                .expect(200)
                .then(({ body }) => {
                    const { article } = body                   
                            expect(article.author).toBe("butter_bridge");
                            expect(article.title).toBe("Living in the shadow of a great man")
                            expect(article.article_id).toBe(1);
                            expect(article.body).toBe("I find this existence challenging");
                            expect(article.topic).toBe("mitch");
                            expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
                            expect(article.votes).toBe(100)                    
                })
            })
            test("status:200 responds with relevant information about a chosen article (3)", () => {
                return request(app)
                .get("/api/articles/3")
                .expect(200)
                .then(({ body }) => {
                    const { article } = body                    
                            expect(article.author).toBe("icellusedkars");
                            expect(article.title).toBe("Eight pug gifs that remind me of mitch");
                            expect(article.article_id).toBe(3);
                            expect(article.body).toBe("some gifs");
                            expect(article.topic).toBe("mitch");
                            expect(article.created_at).toBe("2020-11-03T09:12:00.000Z");
                            expect(article.votes).toBe(0);
               })
            })
            test("status:200 also responds with relevant information about a chosen article (1), now including comment_count", () => {
                return request(app)
                .get("/api/articles/1")
                .expect(200)
                .then(({ body }) => {
                    const { article } = body                   
                            expect(article.author).toBe("butter_bridge");
                            expect(article.title).toBe("Living in the shadow of a great man")
                            expect(article.article_id).toBe(1);
                            expect(article.body).toBe("I find this existence challenging");
                            expect(article.topic).toBe("mitch");
                            expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
                            expect(article.votes).toBe(100)
                            expect(article.comment_count).toBe(11)                    
                })
            })
            test("status:200 also responds with relevant information about a chosen article (3), now including comment_count", () => {
                return request(app)
                .get("/api/articles/3")
                .expect(200)
                .then(({ body }) => {
                    const { article } = body                    
                            expect(article.author).toBe("icellusedkars");
                            expect(article.title).toBe("Eight pug gifs that remind me of mitch");
                            expect(article.article_id).toBe(3);
                            expect(article.body).toBe("some gifs");
                            expect(article.topic).toBe("mitch");
                            expect(article.created_at).toBe("2020-11-03T09:12:00.000Z");
                            expect(article.votes).toBe(0);
                            expect(article.comment_count).toBe(2)
               })
            })
            test("status:200 also responds with relevant information about a chosen article (7), with comment_count indicating 0 if chosen article has none", () => {
                return request(app)
                .get("/api/articles/7")
                .expect(200)
                .then(({ body }) => {
                    const { article } = body                    
                            expect(article.author).toBe("icellusedkars");
                            expect(article.title).toBe("Z");
                            expect(article.article_id).toBe(7);
                            expect(article.body).toBe("I was hungry.");
                            expect(article.topic).toBe("mitch");
                            expect(article.created_at).toBe("2020-01-07T14:08:00.000Z");
                            expect(article.votes).toBe(0);
                            expect(article.comment_count).toBe(0)
               })
            })
        })
        describe("Error Handling", () => {
            test("status: 404 responds with appropriate message when passed a valid, but non-existent, article_id", () => {
                return request(app)
                .get("/api/articles/999")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("Passed ID does not exist")
                })
            })
            test("status: 400 responds with appropiate message when passed an invalid article_id", () => {
                return request(app)
                .get("/api/articles/invalid")
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("Invalid request")
                })
            })
        })
    })
    describe("PATCH", () => {
        describe("Functionality", () => {
            test("status: 204 increments votes for chosen article and responds with article details, including updated vote count", () => {
                const voteAlteration = {
                    inc_votes: 10
                }
                return request(app)
                .patch("/api/articles/1")
                .send(voteAlteration)
                .expect(200)
                .then(({ body }) => {
                const { article } = body             
                    expect(article.author).toBe("butter_bridge");
                    expect(article.title).toBe("Living in the shadow of a great man");
                    expect(article.article_id).toBe(1);
                    expect(article.body).toBe("I find this existence challenging");
                    expect(article.topic).toBe("mitch");
                    expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
                    expect(article.votes).toBe(110)            
                })
            })
            test("status:204 decrements votes for chosen article and responds with article details, including updated vote count", () => {
                const voteAlteration = {
                    inc_votes: '-10'
                }
                return request(app)
                .patch("/api/articles/1")
                .send(voteAlteration)
                .expect(200)
                .then(({ body }) => {
                const { article } = body
                    expect(article.author).toBe("butter_bridge");
                    expect(article.title).toBe("Living in the shadow of a great man");
                    expect(article.article_id).toBe(1);
                    expect(article.body).toBe("I find this existence challenging");
                    expect(article.topic).toBe("mitch");
                    expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
                    expect(article.votes).toBe(90)             
                })
            })
        })
        describe("Error Handling", () => {
            test("status: 404 returns appropriate message when passed a valid, but non-existent, article_id", () => {
                const voteAlteration = {
                    inc_votes: '10'
                }
                return request(app)
                .patch("/api/articles/999")
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe("Passed ID does not exist")
                })
            })
            test("status: 400 returns appropiate message when passed an invalid article_id", () => {
                const voteAlteration = {
                    inc_votes: '10'
                }
                return request(app)
                .patch("/api/articles/invalid")
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid request")
                })
            })
            test("status: 400 responds with appropriate message when passed an invalid value data entry", () => {
                const voteAlteration = {
                    inc_votes: 'hello'
                }
                return request(app)
                .patch("/api/articles/1")
                .send(voteAlteration)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid request")
                })
            })
            test("status: 400 responds with appropriate message when passed an invalid data entry format", () => {
                const voteAlteration = {
                    votes: 9
                }
                return request(app)
                .patch("/api/articles/1")
                .send(voteAlteration)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid data entry, please see relevant endpoint section in documentation for correct syntax")
                })
            })
        })
    })
})

describe("/api/users", () => {
    describe("GET", () => {
        describe("Functionality", () => {
            test("status: 200 responds with an array", () => {
                return request(app)
                .get("/api/users")
                .expect(200)
                .then(({body}) => {
                    const { users } = body
                    expect(users).toBeInstanceOf(Array)
                    expect(users).toHaveLength(4)
                })
            })
            test("status 200: responds with users data with correct keys and value data types", () => {
                return request(app)
                .get("/api/users")
                .expect(200)
                .then(({ body }) => {
                    const { users } = body
                    users.forEach((user) => {
                        expect(user).toEqual(
                            expect.objectContaining({
                                username: expect.any(String),
                                name: expect.any(String),
                                avatar_url: expect.any(String)
                            })
                        )
                    })
                })
            })
        })
    })
})

describe("/api/articles", () => {
    describe("GET", () => {
        describe("Functionality", () => {
            test("status:200 responds with an array", () => {
                return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({body}) => {
                    const { articles } = body
                    expect(articles).toBeInstanceOf(Array)
                    expect(articles).toHaveLength(12)
                })
            })
            test("status: 200 responds with articles data with correct keys and values data", () => {
                return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({body}) => {
                    const { articles } = body
                    articles.forEach((article) => {
                        expect(article.article_id).toEqual(expect.any(Number))
                        expect(article.title).toEqual(expect.any(String))
                        expect(article.topic).toEqual(expect.any(String))
                        expect(article.author).toEqual(expect.any(String))
                        expect(article.body).toEqual(expect.any(String))
                        expect(article.created_at).toEqual(expect.any(String))
                        expect(article.votes).toEqual(expect.any(Number))
                    })
                })
            })
            test("status: 200 responds with articles data with correct keys and values data, including comment_count column", () => {
                return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({body}) => {
                    const { articles } = body
                    articles.forEach((article) => {
                        expect(article.article_id).toEqual(expect.any(Number))
                        expect(article.title).toEqual(expect.any(String))
                        expect(article.topic).toEqual(expect.any(String))
                        expect(article.author).toEqual(expect.any(String))
                        expect(article.body).toEqual(expect.any(String))
                        expect(article.created_at).toEqual(expect.any(String))
                        expect(article.votes).toEqual(expect.any(Number))
                        expect(article.comment_count).toEqual(expect.any(Number))
                    })
                })
            })
            test("status: 200 responds with articles data with correct keys and values data, including articles with 0 comments", () => {
                return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({body}) => {
                    const { articles } = body
                    const doesArticleContaingCommentcount0 = articles.some(article => article['comment_count'] === 0)
                    expect(doesArticleContaingCommentcount0).toBe(true)
                })
            })
            test("status: 200 responds with articles in created_at order, descending", () => {
                return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({body: { articles }} ) => {
                   expect(articles).toBeSortedBy("created_at", { descending: true });
                })
            })
        })
    })
})

describe("/api/articles/:article_id/comments", () => {
    describe("GET", () => {
        describe("Functionality", () => {
            test("staus:200 responds with an array", () => {
                return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({body}) => {
                    const {comments} = body
                    expect(comments).toBeInstanceOf(Array)
                    expect(comments).toHaveLength(11)
                })
            })
            test("status: 200 responds with relevant comment information about a chosen article_id (1)", () => {
                return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({body}) => {
                    const {comments} = body
                    comments.forEach((comment) => {
                        expect(comment.comment_id).toEqual(expect.any(Number))
                        expect(comment.votes).toEqual(expect.any(Number))
                        expect(comment.created_at).toEqual(expect.any(String))
                        expect(comment.author).toEqual(expect.any(String))
                        expect(comment.body).toEqual(expect.any(String))
                    })
                })
            })
            test("status: 200 responds with an empty array when passed a valid article_id that has no comments", () => {
                return request(app)
                .get("/api/articles/2/comments")
                .expect(200)
                .then(({body}) => {
                    const {comments} = body
                    expect(comments).toBeInstanceOf(Array)
                    expect(comments).toHaveLength(0)
                })
            })
        })
        describe("Error Handling", () => {
            test("status: 404 responds with appropriate message when passed a valid, but non-existent, article_id", () => {
                return request(app)
                .get("/api/articles/999/comments")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("Passed ID does not exist")
                })
            })
            test("status: 400 responds with appropiate message when passed an invalid article_id", () => {
                return request(app)
                .get("/api/articles/invalid/comments")
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("Invalid request")
                })
            })
        })
    })
    describe("POST", () => {
        describe("Functionality", () => {
            test.only("status: 201 adds a comment to the comments table and responds with the added comment, followed by checking comment was added to array of comments", () => {
                const newComment = {
                    username: 'butter_bridge',
                    body: "Butter only belongs on toast"
                }
                return request(app)
                .post("/api/articles/2/comments")
                .send(newComment)
                .expect(201)
                .then(({body}) => {
                    expect(body.comment).toEqual({
                        comment_id: 19,
                        votes: 0,
                        author: 'butter_bridge',
                        article_id: 2,
                        created_at: expect.any(String),
                        body: 'Butter only belongs on toast'
                    })
                }).then(()=>{
                    return request(app)
                    .get("/api/articles/2/comments")
                    .expect(200)
                    .then(({body}) => {
                        const {comments} = body
                        expect(comments).toEqual({
                            comment_id: 19,
                            votes: 0,
                            author: "butter_bridge",
                            created_at: expect.any(String),
                            body: "Butter only belongs on toast"
                        })
                    })
                })
            })
            test("status: 201 adds a comment to the comments table and responds with the added comment, followed by checking comment was added to array of comments", () => {
                const newComment = {
                    username: 'butter_bridge',
                    body: "Butter only belongs on toast"
                }
                return request(app)
                .post("/api/articles/1/comments")
                .send(newComment)
                .expect(201)
                .then(({body}) => {
                    expect(body.comment).toEqual({
                        comment_id: 19,
                        votes: 0,
                        author: 'butter_bridge',
                        article_id: 1,
                        created_at: expect.any(String),
                        body: 'Butter only belongs on toast'
                    })
                }).then(()=>{
                    return request(app)
                    .get("/api/articles/1/comments")
                    .expect(200)
                    .then(({body}) => {
                        const {comments} = body
                        expect(comments).toBeInstanceOf(Array)
                        expect(comments).toHaveLength(12)
                    })
                })
            })
        })
        describe("Error Handling", () => {
            test("status: 404 responds with appropriate message when passed a valid, but non-existent, article_id", () => {
                const newComment = {
                    username: 'butter_bridge',
                    body: "Butter only belongs on toast"
                }
                return request(app)
                .post("/api/articles/999/comments")
                .send(newComment)
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("Passed ID does not exist")
                })
            })
            test("status: 400 responds with appropiate message when passed an invalid article_id", () => {
                const newComment = {
                    username: 'butter_bridge',
                    body: "Butter only belongs on toast"
                }
                return request(app)
                .post("/api/articles/invalid/comments")
                .send(newComment)
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("Invalid request")
                })
            })
            test("status: 400 responds with appropriate message when passed an invalid data entry format", () => {
                const newComment = {
                    usernamez: 'butter_bridge',
                    bodee: "Butter only belongs on toast"
                }
                return request(app)
                .post("/api/articles/1/comments")
                .send(newComment)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid data entry, please see relevant endpoint section in documentation for correct syntax")
                })
            })
            test("status: 400 reponds with appropriate message when passed data entry with missing properties", () => {
                const newComment = {
                    username: 'butter_bridge',
                }
                return request(app)
                .post("/api/articles/1/comments")
                .send(newComment)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid data entry, please see relevant endpoint section in documentation for correct syntax")
                })
            })
        })
    })
})
