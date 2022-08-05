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
            test("status: 200 responds with relevant information about a chosen article (1)", () => {
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
            test("status: 200 responds with relevant information about a chosen article (3)", () => {
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
            test("status: 200 also responds with relevant information about a chosen article (1), now including comment_count", () => {
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
            test("status: 200 also responds with relevant information about a chosen article (3), now including comment_count", () => {
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
            test("status: 200 also responds with relevant information about a chosen article (7), with comment_count indicating 0 if chosen article has none", () => {
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
                    expect(article.author).toBe("butter_bridge");
                    expect(article.title).toBe("Living in the shadow of a great man");
                    expect(article.article_id).toBe(1);
                    expect(article.body).toBe("I find this existence challenging");
                    expect(article.topic).toBe("mitch");
                    expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
                    expect(article.votes).toBe(110)            
                })
            })
            test("status: 200 decrements votes for chosen article and responds with article details, including updated vote count", () => {
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
            test("status: 404 responds with appropriate message when passed a valid, but non-existent, article_id", () => {
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
            test("status: 400 responds with appropiate message when passed an invalid article_id", () => {
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
                    expect(body.msg).toBe("Invalid data entry, please see relevant section in /api endpoint for correct syntax")
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
            test("status: 200 responds with users data with correct keys and value data types", () => {
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
            test("status: 200 responds with an array", () => {
                return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({body}) => {
                    const { articles } = body
                    expect(articles).toBeInstanceOf(Array)
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
            test("status: 200 responds with articles in created_at order (default), descending order (default)", () => {
                return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({body: { articles }} ) => {
                   expect(articles).toBeSortedBy("created_at", { descending: true });
                })
            })
            test("status: 200 responds with articles data, sorted by a passed query (default: descending)", () => {
                return request(app)
                .get("/api/articles?sort_by=votes")
                .expect(200)
                .then(({body : { articles }}) => {
                    expect(articles).toBeSortedBy("votes", { descending: true })
                })
            })
            test("status: 200 responds with articles data, sorted by a passed query (default: descending)", () => {
                return request(app)
                .get("/api/articles?sort_by=author")
                .expect(200)
                .then(({body : { articles }}) => {
                    expect(articles).toBeSortedBy("author", { descending: true })
                })
            })
            test("status: 200 responds with articles data, sorted by a created_at (default) in ascending order", () => {
                return request(app)
                .get("/api/articles?order=asc")
                .expect(200)
                .then(({body : { articles }}) => {
                    expect(articles).toBeSortedBy("created_at")
                })
            })
            test("status: 200 responds with articles data, sorted by a passed query with order passed by user", () => {
                return request(app)
                .get("/api/articles?sort_by=votes&order=asc")
                .expect(200)
                .then(({body : { articles }}) => {
                    expect(articles).toBeSortedBy("votes")
                })
            })
            test("status: 200 responds with articles data, sorted by a passed query with order passed by user", () => {
                return request(app)
                .get("/api/articles?sort_by=topic&order=asc")
                .expect(200)
                .then(({body : { articles }}) => {
                    expect(articles).toBeSortedBy("topic")
                })
            })
            test("status: 200 responds with articles data, filtered by a passed query", () => {
                return request(app)
                .get("/api/articles?topic=cats")
                .expect(200)
                .then(({body : { articles }}) => {
                    expect(articles).toEqual({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: "cats",
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(Number)
                    })
                })
            })
            test("status: 200 responds with articles data, filtered by a passed query, descending order (default)", () => {
                return request(app)
                .get("/api/articles?topic=mitch")
                .expect(200)
                .then(({body : { articles }}) => {
                    expect(articles).toBeInstanceOf(Array)
                    expect(articles).toBeSortedBy("created_at", { descending: true})
                    articles.forEach((article) => {
                        expect(article).toEqual(
                            expect.objectContaining({
                                topic: "mitch",
                                article_id: expect.any(Number),
                                title: expect.any(String),
                                author: expect.any(String),
                                body: expect.any(String),
                                created_at: expect.any(String),
                                votes: expect.any(Number),
                                comment_count: expect.any(Number)
                            })
                        )
                    })
                })
            })
            test("status: 200 responds with articles data, filtered by a passed query, sorted by created_at (default) and ordered by passed query", () => {
                return request(app)
                .get("/api/articles?topic=mitch&order=asc")
                .expect(200)
                .then(({body : { articles }}) => {
                    expect(articles).toBeInstanceOf(Array)
                    expect(articles).toBeSortedBy("created_at")
                    articles.forEach((article) => {
                        expect(article).toEqual(
                            expect.objectContaining({
                                topic: "mitch",
                                article_id: expect.any(Number),
                                title: expect.any(String),
                                author: expect.any(String),
                                body: expect.any(String),
                                created_at: expect.any(String),
                                votes: expect.any(Number),
                                comment_count: expect.any(Number)
                            })
                        )
                    })
                })
            })
            test("status: 200 responds with articles data, filtered by a passed query and ordered by a selected property, ascending", () => {
                return request(app)
                .get("/api/articles?topic=mitch&sort_by=votes&order=asc")
                .expect(200)
                .then(({body : { articles }}) => {
                    expect(articles).toBeInstanceOf(Array)
                    expect(articles).toBeSortedBy("votes")
                    articles.forEach((article) => {
                        expect(article).toEqual(
                            expect.objectContaining({
                                topic: "mitch",
                                article_id: expect.any(Number),
                                title: expect.any(String),
                                author: expect.any(String),
                                body: expect.any(String),
                                created_at: expect.any(String),
                                votes: expect.any(Number),
                                comment_count: expect.any(Number)
                            })
                        )
                    })
                })
            })
            test("status: 200 responds with articles data, filtered by a passed query and ordered by a selected property (default, descending)", () => {
                return request(app)
                .get("/api/articles?topic=mitch&sort_by=votes")
                .expect(200)
                .then(({body : { articles }}) => {
                    expect(articles).toBeInstanceOf(Array)
                    expect(articles).toBeSortedBy("votes", { descending: true })
                    articles.forEach((article) => {
                        expect(article).toEqual(
                            expect.objectContaining({
                                topic: "mitch",
                                article_id: expect.any(Number),
                                title: expect.any(String),
                                author: expect.any(String),
                                body: expect.any(String),
                                created_at: expect.any(String),
                                votes: expect.any(Number),
                                comment_count: expect.any(Number)
                            })
                        )
                    })
                })
            })
            test("status: 200 responds with empty array if filter query does not yield any results", () => {
                return request(app)
                .get("/api/articles?topic=dogs")
                .expect(200)
                .then(({body : { articles }}) => {
                    expect(articles).toBeInstanceOf(Array)
                    expect(articles).toHaveLength(0)
                })
            }),
            test("status: 200 responds with limited length array of results when passed a limit query", () => {
                return request(app)
                .get("/api/articles?limit=5")
                .expect(200)
                .then(({body}) => {
                    const { articles } = body
                    expect(articles).toBeInstanceOf(Array)
                    expect(articles).toHaveLength(5)
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
            test("status: 200 responds with array of results, limited to 10, if no limit query passed", () => {
                return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({body}) => {
                    const { articles } = body
                    expect(articles).toBeInstanceOf(Array)
                    expect(articles).toHaveLength(10)
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
            test("status: 200 responds with articles data, limited to 10 (default), filtered by a passed query, sorted by created_at (default) and ordered by passed query", () => {
                return request(app)
                .get("/api/articles?topic=mitch&order=asc")
                .expect(200)
                .then(({body : { articles }}) => {
                    expect(articles).toBeInstanceOf(Array)
                    expect(articles).toHaveLength(10)
                    expect(articles).toBeSortedBy("created_at")
                    articles.forEach((article) => {
                        expect(article).toEqual(
                            expect.objectContaining({
                                topic: "mitch",
                                article_id: expect.any(Number),
                                title: expect.any(String),
                                author: expect.any(String),
                                body: expect.any(String),
                                created_at: expect.any(String),
                                votes: expect.any(Number),
                                comment_count: expect.any(Number)
                            })
                        )
                    })
                })
            })
            test("status: 200 responds with articles data, limited to 5, filtered by a passed query, sorted by created_at (default) and ordered by passed query", () => {
                return request(app)
                .get("/api/articles?topic=mitch&order=asc&limit=5")
                .expect(200)
                .then(({body : { articles }}) => {
                    expect(articles).toBeInstanceOf(Array)
                    expect(articles).toHaveLength(5)
                    expect(articles).toBeSortedBy("created_at")
                    articles.forEach((article) => {
                        expect(article).toEqual(
                            expect.objectContaining({
                                topic: "mitch",
                                article_id: expect.any(Number),
                                title: expect.any(String),
                                author: expect.any(String),
                                body: expect.any(String),
                                created_at: expect.any(String),
                                votes: expect.any(Number),
                                comment_count: expect.any(Number)
                            })
                        )
                    })
                })
            })
            test("status: 200 responds with the first 3 articles that follow passed queries", () => {
                const expected = [
                    {
                        article_id: 12,
                        title: 'Moustache',
                        topic: 'mitch',
                        author: 'butter_bridge',
                        body: 'Have you seen the size of that thing?',
                        created_at: "2020-10-11T11:24:00.000Z",
                        votes: 0,
                        comment_count: 0
                      },
                      {
                        article_id: 11,
                        title: 'Am I a cat?',
                        topic: 'mitch',
                        author: 'icellusedkars',
                        body: 'Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?',
                        created_at: "2020-01-15T22:21:00.000Z",
                        votes: 0,
                        comment_count: 0
                      },
                      {
                        article_id: 10,
                        title: 'Seven inspirational thought leaders from Manchester UK',
                        topic: 'mitch',
                        author: 'rogersop',
                        body: "Who are we kidding, there is only one, and it's Mitch!",
                        created_at: "2020-05-14T04:15:00.000Z",
                        votes: 0,
                        comment_count: 0
                      }
                ]
                return request(app)
                .get("/api/articles?sort_by=article_id&limit=3")
                .expect(200)
                .then(({body}) => {
                    const{ articles } = body
                    expect(articles).toEqual(expected)
                })
            })
            test("status: 200 responds with the relevant articles that follow passed queries of sort_by, limit and page number", () => {
                const expected = [
                    {
                        article_id: 9,
                        title: "They're not exactly dogs, are they?",
                        topic: 'mitch',
                        author: 'butter_bridge',
                        body: 'Well? Think about it.',
                        created_at: "2020-06-06T09:10:00.000Z",
                        votes: 0,
                        comment_count: 2
                      },
                      {
                        article_id: 8,
                        title: 'Does Mitch predate civilisation?',
                        topic: 'mitch',
                        author: 'icellusedkars',
                        body: 'Archaeologists have uncovered a gigantic statue from the dawn of humanity, and it has an uncanny resemblance to Mitch. Surely I am not the only person who can see this?!',
                        created_at: "2020-04-17T01:08:00.000Z",
                        votes: 0,
                        comment_count: 0
                      },
                      {
                        article_id: 7,
                        title: 'Z',
                        topic: 'mitch',
                        author: 'icellusedkars',
                        body: 'I was hungry.',
                        created_at: "2020-01-07T14:08:00.000Z",
                        votes: 0,
                        comment_count: 0
                      }
                ]
                return request(app)
                .get("/api/articles?sort_by=article_id&limit=3&page=2")
                .expect(200)
                .then(({body}) => {
                    const{ articles } = body
                    expect(articles).toEqual(expected)
                })
            })
            test("status: 200 responds with the relevant articles that follow passed queries of sort_by, limit and page number", () => {
                const expected = [
                    {
                        article_id: 6,
                        title: 'A',
                        topic: 'mitch',
                        author: 'icellusedkars',
                        body: 'Delicious tin of cat food',
                        created_at: "2020-10-18T01:00:00.000Z",
                        votes: 0,
                        comment_count: 1
                      },
                      {
                        article_id: 5,
                        title: 'UNCOVERED: catspiracy to bring down democracy',
                        topic: 'cats',
                        author: 'rogersop',
                        body: 'Bastet walks amongst us, and the cats are taking arms!',
                        created_at: "2020-08-03T13:14:00.000Z",
                        votes: 0,
                        comment_count: 2
                      },
                      {
                        article_id: 4,
                        title: 'Student SUES Mitch!',
                        topic: 'mitch',
                        author: 'rogersop',
                        body: 'We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages',
                        created_at: "2020-05-06T01:14:00.000Z",
                        votes: 0,
                        comment_count: 0
                      }
                ]
                return request(app)
                .get("/api/articles?sort_by=article_id&limit=3&page=3")
                .expect(200)
                .then(({body}) => {
                    const{ articles } = body
                    expect(articles).toEqual(expected)
                })
            })
            test("status: 200 responds with the relevant articles that follow passed queries of sort_by, limit and page number", () => {
                const expected = [
                    {
                        article_id: 3,
                        title: 'Eight pug gifs that remind me of mitch',
                        topic: 'mitch',
                        author: 'icellusedkars',
                        body: 'some gifs',
                        created_at: "2020-11-03T09:12:00.000Z",
                        votes: 0,
                        comment_count: 2
                      },
                      {
                        article_id: 2,
                        title: 'Sony Vaio; or, The Laptop',
                        topic: 'mitch',
                        author: 'icellusedkars',
                        body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
                        created_at: "2020-10-16T05:03:00.000Z",
                        votes: 0,
                        comment_count: 0
                      },
                      {
                        article_id: 1,
                        title: 'Living in the shadow of a great man',
                        topic: 'mitch',
                        author: 'butter_bridge',
                        body: 'I find this existence challenging',
                        created_at: "2020-07-09T20:11:00.000Z",
                        votes: 100,
                        comment_count: 11
                      }
                ]
                return request(app)
                .get("/api/articles?sort_by=article_id&limit=3&page=4")
                .expect(200)
                .then(({body}) => {
                    const{ articles } = body
                    expect(articles).toEqual(expected)
                })
            })
            test("status: 200 responds with an empty array if user attempts to access a page with no articles present", () => {
                return request(app)
                .get("/api/articles?sort_by=article_id&limit=3&page=5")
                .expect(200)
                .then(({body}) => {
                    const{ articles } = body
                    expect(articles).toBeInstanceOf(Array)
                    expect(articles).toHaveLength(0)
                })
            })
        })
        describe("Error Handling", () => {
            test("status: 400 responds with appropriate message if user attempts to sort_by invalid property", () => {
                return request(app)
                .get("/api/articles?sort_by=word_count")
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid query parameter")
                })
            })
            test("status: 400 responds with appropriate message if user attempts to order using invalid syntax", () => {
                return request(app)
                .get("/api/articles?order=ascending")
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid query parameter")
                })
            })
            test("status: 400 responds with appropriate message if query property does not exist (single query)", () => {
                return request(app)
                .get("/api/articles?sortby=votes")
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid query property")
                })
            })
            test("status: 400 responds with appropriate message if query property does not exist (multiple queries)", () => {
                return request(app)
                .get("/api/articles?sortby=votes&order=asc")
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid query property")
                })
            })
            test("status: 400 responds with appropriate message if limit value is not a number", () => {
                return request(app)
                .get("/api/articles?limit=invalid")
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid query parameter")
                })
            })
            test("status: 400 responds with appropriate message if query property does not exist (single query)", () => {
                return request(app)
                .get("/api/articles?limt=7")
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid query property")
                })
            })
            test("status: 400 responds with appropriate message if query property does not exist (multiple queries)", () => {
                return request(app)
                .get("/api/articles?sort_by=votes&limt=7")
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid query property")
                })
            })
            test("status: 400 responds with appropriate message if query property does not exist (single query)", () => {
                return request(app)
                .get("/api/articles?pag=2")
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid query property")
                })
            })
            test("status: 400 responds with appropriate message if page value is not a number", () => {
                return request(app)
                .get("/api/articles?page=invalid")
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid query parameter")
                })
            })
        })
    })
    describe("POST", () => {
        describe("Functionality", () => {
            test("status: 201 responds with a newly added article", () => {
                const newArticle = {
                    author: "lurker",
                    title: "white lies",
                    body: "matt coated paper? More like FLAT coated paper!",
                    topic:"paper"
                }
                return request(app)
                .post("/api/articles")
                .send(newArticle)
                .expect(201)
                .then(({body}) => {
                    const { article } = body
                    expect(article.author).toBe("lurker"),
                    expect(article.title).toBe("white lies"),
                    expect(article.body).toBe("matt coated paper? More like FLAT coated paper!"),
                    expect(article.topic).toBe("paper"),
                    expect(article.article_id).toBe(13),
                    expect(article.votes).toBe(0),
                    expect(article.created_at).toEqual(expect.any(String))
                })
            })
            test("status: 201 responds with a newly added article then checks article can be retrieved", () => {
                const newArticle = {
                    author: "lurker",
                    title: "white lies",
                    body: "matt coated paper? More like FLAT coated paper!",
                    topic:"paper"
                }
                return request(app)
                .post("/api/articles")
                .send(newArticle)
                .expect(201)
                .then(({body}) => {
                    const { article } = body
                    expect(article.author).toBe("lurker"),
                    expect(article.title).toBe("white lies"),
                    expect(article.body).toBe("matt coated paper? More like FLAT coated paper!"),
                    expect(article.topic).toBe("paper"),
                    expect(article.article_id).toBe(13),
                    expect(article.votes).toBe(0),
                    expect(article.created_at).toEqual(expect.any(String))
                }).then(() => {
                    return request(app)
                    .get("/api/articles/13")
                    .expect(200)
                    .then(({body}) => {
                        const { article } = body
                    expect(article.author).toBe("lurker"),
                    expect(article.title).toBe("white lies"),
                    expect(article.body).toBe("matt coated paper? More like FLAT coated paper!"),
                    expect(article.topic).toBe("paper"),
                    expect(article.votes).toBe(0),
                    expect(article.created_at).toEqual(expect.any(String))
                    })
                })
            })
            test("status: 201 responds with a newly added article, also with comment_count column", () => {
                const newArticle = {
                    author: "lurker",
                    title: "white lies",
                    body: "matt coated paper? More like FLAT coated paper!",
                    topic:"paper"
                }
                return request(app)
                .post("/api/articles")
                .send(newArticle)
                .expect(201)
                .then(({body}) => {
                    const { article } = body
                    expect(article.author).toBe("lurker"),
                    expect(article.title).toBe("white lies"),
                    expect(article.body).toBe("matt coated paper? More like FLAT coated paper!"),
                    expect(article.topic).toBe("paper"),
                    expect(article.article_id).toBe(13),
                    expect(article.votes).toBe(0),
                    expect(article.created_at).toEqual(expect.any(String)),
                    expect(article.comment_count).toBe(0)
                })
            })
        })
        describe("Error Handling", () => {
            test("status: 400 responds with appropriate message when passed and invalid data entry format (1)", () => {
                const newArticle = {
                    auther: "lurker",
                    title: "white lies",
                    body: "matt coated paper? More like FLAT coated paper!",
                    topic:"paper"
                }
                return request(app)
                .post("/api/articles")
                .send(newArticle)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid data entry, please see relevant section in /api endpoint for correct syntax")
                })
            })
            test("status: 400 responds with appropriate message when passed and invalid data entry format (2)", () => {
                const newArticle = {
                    author: "lurker",
                    titel: "white lies",
                    body: "matt coated paper? More like FLAT coated paper!",
                    topic:"paper"
                }
                return request(app)
                .post("/api/articles")
                .send(newArticle)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid data entry, please see relevant section in /api endpoint for correct syntax")
                })
            })
            test("status: 400 responds with appropriate message when passed and invalid data entry format (3)", () => {
                const newArticle = {
                    author: "lurker",
                    title: "white lies",
                    bodee: "matt coated paper? More like FLAT coated paper!",
                    topic:"paper"
                }
                return request(app)
                .post("/api/articles")
                .send(newArticle)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid data entry, please see relevant section in /api endpoint for correct syntax")
                })
            })
            test("status: 400 responds with appropriate message when passed and invalid data entry format (4)", () => {
                const newArticle = {
                    author: "lurker",
                    title: "white lies",
                    body: "matt coated paper? More like FLAT coated paper!",
                    toopic: "paper"
                }
                return request(app)
                .post("/api/articles")
                .send(newArticle)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid data entry, please see relevant section in /api endpoint for correct syntax")
                })
            })
            test("status: 400 responds with appropriate message when passed an incomplete data entry body", () => {
                const newArticle = {
                    author: "lurker",
                    title: "white lies",
                    body: "matt coated paper? More like FLAT coated paper!",
                }
                return request(app)
                .post("/api/articles")
                .send(newArticle)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid data entry, please see relevant section in /api endpoint for correct syntax")
                })
            })
            test("status: 400 responds with appropriate message when passed a data entry body with an invalid referenced value (1)", () => {
                const newArticle = {
                    author: "lurker",
                    title: "white lies",
                    body: "matt coated paper? More like FLAT coated paper!",
                    topic: ""
                }
                return request(app)
                .post("/api/articles")
                .send(newArticle)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Value reference error")
                })
            })
            test("status: 400 responds with appropriate message when passed a data entry body with an invalid referenced value (2)", () => {
                const newArticle = {
                    author: "",
                    title: "white lies",
                    body: "matt coated paper? More like FLAT coated paper!",
                    topic: "paper"
                }
                return request(app)
                .post("/api/articles")
                .send(newArticle)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Value reference error")
                })
            })
            test("status: 400 responds with appropriate message when passed an incomplete data entry body (1)", () => {
                const newArticle = {
                    author: "lurker",
                    title: "",
                    body: "matt coated paper? More like FLAT coated paper!",
                    topic: "paper"
                }
                return request(app)
                .post("/api/articles")
                .send(newArticle)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid data entry, please see relevant section in /api endpoint for correct syntax")
                })
            })
            test("status: 400 responds with appropriate message when passed an incomplete data entry body (2)", () => {
                const newArticle = {
                    author: "lurker",
                    title: "white lies",
                    body: "",
                    topic: "paper"
                }
                return request(app)
                .post("/api/articles")
                .send(newArticle)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid data entry, please see relevant section in /api endpoint for correct syntax")
                })
            })
            test("status: 400 reponds with appropriate message when passed a data entry body with additional properties", () => {
                const newArticle = {
                    author: "lurker",
                    title: "white lies",
                    body: "matt coated paper? More like FLAT coated paper!",
                    topic:"paper",
                    extra: "test"
                }
                return request(app)
                .post("/api/articles")
                .send(newArticle)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid data entry, please see relevant section in /api endpoint for correct syntax")
                })
            })
        })
    })
})

describe("/api/articles/:article_id/comments", () => {
    describe("GET", () => {
        describe("Functionality", () => {
            test("status: 200 responds with an array", () => {
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
            test("status: 201 adds a comment to the comments table and responds with the added comment, followed by checking comment was added to array of comments", () => {
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
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("Value reference error")
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
                    expect(body.msg).toBe("Invalid data entry, please see relevant section in /api endpoint for correct syntax")
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
                    expect(body.msg).toBe("Invalid data entry, please see relevant section in /api endpoint for correct syntax")
                })
            })
            test("status: 400 reponds with appropriate message when passed data entry with extra properties", () => {
                const newComment = {
                    username: 'butter_bridge',
                    body: "Butter only belongs on toast",
                    extra: "or just plain bread"
                }
                return request(app)
                .post("/api/articles/1/comments")
                .send(newComment)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid data entry, please see relevant section in /api endpoint for correct syntax")
                })
            })
        })
    })
})

describe("/api/comments", () => {
    describe("GET", () => {
        describe("Functionality", () => {
            test("status: 200 reponds with array of comments", () => {
                return request(app)
                    .get("/api/comments")
                    .expect(200)
                    .then(({body}) => {
                        const {comments} = body
                        expect(comments).toBeInstanceOf(Array)
                        expect(comments).toHaveLength(18)
                        comments.forEach((comment) => {
                            expect(comment).toEqual(
                                expect.objectContaining({
                                    body: expect.any(String),
                                    votes: expect.any(Number),
                                    author: expect.any(String),
                                    article_id: expect.any(Number),
                                    created_at: expect.any(String),
                                    comment_id: expect.any(Number)
                                })
                            )
                        })
                    })
                })
            })
        })
})

describe("/api/comments/:comment_id", () => {
    describe("DELETE", () => {
        describe("Functionality", () => {
            test("status: 204 removes a comment by user passed comment_id", () => {
                return request(app)
                .delete("/api/comments/1")
                .expect(204)
            })
            test("status: 200 removes a comment by user passed comment_id, then checks if comment has been deleted", () => {
                return request(app)
                .delete("/api/comments/1")
                .expect(204)
                .then(() => {
                    return request(app)
                    .get("/api/comments")
                    .expect(200)
                    .then(({body}) => {
                        const {comments} = body
                        expect(comments).toBeInstanceOf(Array)
                        expect(comments).toHaveLength(17)
                        comments.forEach((comment) => {
                            expect(comment).toEqual(
                                expect.objectContaining({
                                    body: expect.any(String),
                                    votes: expect.any(Number),
                                    author: expect.any(String),
                                    article_id: expect.any(Number),
                                    created_at: expect.any(String)
                                })
                            )
                            expect(comment).not.toEqual(
                                expect.objectContaining({
                                    comment_id: 1
                                })
                            )
                        })
                    })
                })
            })
        })
        describe("Error Handling", () => {
            test("status: 400 responds with appropriate message if user passes an invalid comment_id", () => {
                return request(app)
                .delete("/api/comments/invalid")
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid request")
                })
            })
            test("status: 404 reponds with appropriate message if user passed a valid, but non-existent, comment_id", () => {
                return request(app)
                .delete("/api/comments/999")
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe("Passed ID does not exist")
                })
            })
        })
    })
    describe("PATCH", () => {
        describe('Functionality', () => {
            test('status: 200 increments votes for chosen comment and responds with comment details, including updated vote count', () => {
                const voteAlteration = {
                    inc_votes: '10'
                }
                return request(app)
                .patch("/api/comments/1")
                .send(voteAlteration)
                .expect(200)
                .then(({body}) => {
                    const {comment} = body
                    expect(comment.comment_id).toBe(1)
                    expect(comment.body).toBe("Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!")
                    expect(comment.author).toBe("butter_bridge")
                    expect(comment.article_id).toBe(9)
                    expect(comment.votes).toBe(26)
                    expect(comment.created_at).toEqual(expect.any(String))
                })
            });
            test('status: 200 decrements votes for chosen comment and responds with comment details, including updated vote count', () => {
                const voteAlteration = {
                    inc_votes: '-10'
                }
                return request(app)
                .patch("/api/comments/1")
                .send(voteAlteration)
                .expect(200)
                .then(({body}) => {
                    const {comment} = body
                    expect(comment.comment_id).toBe(1)
                    expect(comment.body).toBe("Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!")
                    expect(comment.author).toBe("butter_bridge")
                    expect(comment.article_id).toBe(9)
                    expect(comment.votes).toBe(6)
                    expect(comment.created_at).toEqual(expect.any(String))
                })
            });
        });
        describe("Error Handling", () => {
            test('status: 404 responds with appropriate message when passed a valid, but non-existent, comment_id ', () => {
                const voteAlteration = {
                    inc_votes: '-10'
                }
                return request(app)
                .patch("/api/comments/999")
                .send(voteAlteration)
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe("Passed ID does not exist")
                })
            })
            test("status: 400 responds with appropiate message when passed an invalid comment_id", () => {
                const voteAlteration = {
                    inc_votes: '10'
                }
                return request(app)
                .patch("/api/comments/invalid")
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
                .patch("/api/comments/1")
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
                .patch("/api/comments/1")
                .send(voteAlteration)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid data entry, please see relevant section in /api endpoint for correct syntax")
                })
            })
        })
    })
})

describe("/api", () => {
    describe("GET", () => {
        describe("Functionality", () => {
            test("status: 200 responds with information on all available endpoints", () => {
                return request(app)
                .get("/api")
                .expect(200)
                .then(({body}) => {
                    const endpoint1 = "GET /api"
                    const endpoint2 = "GET /api/topics"
                    const endpoint3 = "GET /api/articles"
                    const endpoint4 = "GET /api/articles/:article_id"
                    const endpoint5 = "PATCH /api/articles/:article_id"
                    const endpoint6 = "GET /api/users"
                    const endpoint7 = "GET /api/comments"
                    const endpoint8 = "GET /api/articles/:article_id/comments"
                    const endpoint9 = "POST /api/articles/:article_id/comments"
                    const endpoint10 = "DELETE /api/comments/:comment_id"
                    const endpoint11 = "PATCH /api/comments/:comment_id"
                    const endpoint12 = "GET /api/users/:username"
                    const endpoint13 = "POST /api/articles"
                    expect(typeof body.endpoints).toEqual('object')
                    expect(body.endpoints.hasOwnProperty(endpoint1)).toBe(true)
                    expect(body.endpoints.hasOwnProperty(endpoint2)).toBe(true)
                    expect(body.endpoints.hasOwnProperty(endpoint3)).toBe(true)
                    expect(body.endpoints.hasOwnProperty(endpoint4)).toBe(true)
                    expect(body.endpoints.hasOwnProperty(endpoint5)).toBe(true)
                    expect(body.endpoints.hasOwnProperty(endpoint6)).toBe(true)
                    expect(body.endpoints.hasOwnProperty(endpoint7)).toBe(true)
                    expect(body.endpoints.hasOwnProperty(endpoint8)).toBe(true)
                    expect(body.endpoints.hasOwnProperty(endpoint9)).toBe(true)
                    expect(body.endpoints.hasOwnProperty(endpoint10)).toBe(true)
                    expect(body.endpoints.hasOwnProperty(endpoint11)).toBe(true)
                    expect(body.endpoints.hasOwnProperty(endpoint12)).toBe(true)
                    expect(body.endpoints.hasOwnProperty(endpoint13)).toBe(true)
                })
            })
        })
    })
})

describe("/api/users/:username", () => {
    describe("GET", () => {
        describe("Functionality", () => {
            test('status: 200 responds with relevant information about a user selected User', () => {
                return request(app)
                .get("/api/users/butter_bridge")
                .expect(200)
                .then(({body}) => {
                    const {user} = body
                    expect(user.username).toBe("butter_bridge"),
                    expect(user.name).toBe("jonny"),
                    expect(user.avatar_url).toBe("https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg")
                })
            })
            test('status: 200 responds with relevant information about a user selected User', () => {
                return request(app)
                .get("/api/users/rogersop")
                .expect(200)
                .then(({body}) => {
                    const {user} = body
                    expect(user.username).toBe("rogersop"),
                    expect(user.name).toBe("paul"),
                    expect(user.avatar_url).toBe("https://avatars2.githubusercontent.com/u/24394918?s=400&v=4")
                })
            })
        })
        describe("Error Handling", () => {
            test('status: 404 responds with appropriate message when passed a valid, but non-existent, username', () => {
                return request(app)
                .get("/api/users/melon_man")
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe("Passed username does not exist")
                })
            })
            test('status: 400 responds with appropriate message when passed an invalid username', () => {
                
            })
        })
    })
})