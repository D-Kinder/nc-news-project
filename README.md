# Northcoders News API

## Background

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

**Initial Set Up**

Create a `.env.development` and `.env.test` file, using the the `.env-example` file as a template, to ensure the correct database name is used for each environment.  The database names can be found in the `setup.sql` file.  

Then run `npm setup-dbs` to create the database before proceeding.

## API endpoints

The following are valid endpoints that can be used to access/ modify the databases via the server.

### 1. GET /api/topics

Responds with a JSON object containing a key of `topics` with a value of an array containing all of the topics objects.

E.g.
```js
{ 
    "topics": [
    {
    description: 'The man, the Mitch, the legend',
    slug: 'mitch'
  },
  {
    description: 'Not dogs',
    slug: 'cats'
  },
  {
    description: 'what books are made of',
    slug: 'paper'
  }
]
}
```

### GET /api/articles/:article_id

Accepts an article_id, entered as an integer, and responds with a JSON object containing a key of `article` with a value of an object containing all information on the requested article.

E.g.

`GET /api/articles/1` Responds with...

```js
{
  "article": {
    author: "butter_bridge",
    title: "Living in the shadow of a great man",
    article_id: 1,
    body: "I find this existence challenging",
    topic: "mitch",
    created_at: "2020-07-09T20:11:00.000Z",
    votes: 100
  }
}
```
