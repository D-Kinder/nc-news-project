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


describe("api/topics", () => {
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
            test("status 200: returns topics data with correct keys and value data types", () => {
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

describe("api/articles/:article_id", () => {
    describe("GET", () => {
        describe("Functionality", () => {
            test("status:200 returns relevant information about a chosen article (1)", () => {
                return request(app)
                .get("/api/articles/1")
                .expect(200)
                .then(({ body }) => {
                    const { article } = body
                    expect(article).toEqual(
                        expect.objectContaining({
                            author: "butter_bridge",
                            title: "Living in the shadow of a great man",
                            article_id: 1,
                            body: "I find this existence challenging",
                            topic: "mitch",
                            created_at: "2020-07-09T20:11:00.000Z",
                            votes: 100
                        })
                    )
                })
            })
            test("status:200 returns relevant information about a chosen article (3)", () => {
                return request(app)
                .get("/api/articles/3")
                .expect(200)
                .then(({ body }) => {
                    const { article } = body
                    expect(article).toEqual(
                        expect.objectContaining({
                            author: "icellusedkars",
                            title: "Eight pug gifs that remind me of mitch",
                            article_id: 3,
                            body: "some gifs",
                            topic: "mitch",
                            created_at: "2020-11-03T09:12:00.000Z",
                            votes: 0
                        })
                    )
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
            test("status: 200 increments votes for chosen article and responds with article details, including updated vote count", () => {
                const voteAlteration = {
                    inc_votes: 10
                }
                return request(app)
                .patch("/api/articles/1")
                .send(voteAlteration)
                .expect(200)
                .then(({ body }) => {
                const { article } = body
                expect(article).toEqual({
                    author: "butter_bridge",
                    title: "Living in the shadow of a great man",
                    article_id: 1,
                    body: "I find this existence challenging",
                    topic: "mitch",
                    created_at: "2020-07-09T20:11:00.000Z",
                    votes: 110
                })
                })
            })
            test("status:200 decrements votes for chosen article and responds with article details, including updated vote count", () => {
                const voteAlteration = {
                    inc_votes: '-10'
                }
                return request(app)
                .patch("/api/articles/1")
                .send(voteAlteration)
                .expect(200)
                .then(({ body }) => {
                const { article } = body
                expect(article).toEqual({
                    author: "butter_bridge",
                    title: "Living in the shadow of a great man",
                    article_id: 1,
                    body: "I find this existence challenging",
                    topic: "mitch",
                    created_at: "2020-07-09T20:11:00.000Z",
                    votes: 90
                })
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
