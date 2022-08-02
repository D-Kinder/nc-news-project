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
            test("status 200: returns an array", () => {
                return request(app)
                .get("/api/topics")
                .expect(200)
                .then(({ body }) => {
                    const { topics } = body
                    expect(topics).toBeInstanceOf(Array)
                    expect(topics).toHaveLength(3)
                })
            })
            test("status 200: returns topics data with correct keys and values data", () => {
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
            test("status:200 returns relevant information about a chosen article (1)", () => {
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
            test("status:200 returns relevant information about a chosen article (3)", () => {
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
            test("status:200 also returns relevant information about a chosen article (1), now including comment_count", () => {
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
            test("status:200 also returns relevant information about a chosen article (3), now including comment_count", () => {
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
            test("status:200 also returns relevant information about a chosen article (7), with comment_count indicating 0 if chosen article has none", () => {
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
            test("status: 404 returns appropriate message when passed a valid, but non-existent, article_id", () => {
                return request(app)
                .get("/api/articles/999")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("Passed ID does not exist")
                })
            })
            test("status: 400 returns appropiate message when passed an invalid article_id", () => {
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
            test("status: 400 returns appropriate message when passed an invalid 'inc_vote' data entry", () => {
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
            test("status: 400 returns appropriate message when passed an invalid data entry format", () => {
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
            test("status: 200 returns an array", () => {
                return request(app)
                .get("/api/users")
                .expect(200)
                .then(({body}) => {
                    const { users } = body
                    expect(users).toBeInstanceOf(Array)
                    expect(users).toHaveLength(4)
                })
            })
            test("status 200: returns users data with correct keys and value data types", () => {
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
            test("status:200 returns an array", () => {
                return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({body}) => {
                    const { articles } = body
                    expect(articles).toBeInstanceOf(Array)
                    expect(articles).toHaveLength(12)
                })
            })
            test("status: 200 returns articles data with correct keys and values data", () => {
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
            test("status: 200 returns articles data with correct keys and values data, including comment_count column", () => {
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
            test("status: 200 returns articles data with correct keys and values data, including articles with 0 comments", () => {
                return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({body}) => {
                    const { articles } = body
                    const doesArticleContaingCommentcount0 = articles.some(article => article['comment_count'] === 0)
                    expect(doesArticleContaingCommentcount0).toBe(true)
                })
            })
        })
    })
})
