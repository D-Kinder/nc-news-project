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
                    expect(articles).toHaveLength(11)
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
                    expect(articles).toHaveLength(11)
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
                    expect(articles).toHaveLength(11)
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
                    expect(articles).toHaveLength(11)
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
                })
            })
        })
    })
})