# Northcoders News API

## Background

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

**Initial Set Up**

Create a `.env.development` and `.env.test` file, using the the `.env-example` file as a template, to ensure the correct database name is used for each environment.  The database names can be found in the `setup.sql` file.  

Then run `npm setup-dbs` to create the database before proceeding.

## API endpoints

The following are valid endpoints that can be used to access/ modify the databases via the server.

### 1. /api/topics

### GET

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

### 2. /api/articles/:article_id

### GET

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

### PATCH

Accepts an article_id, entered as an integer, and body of information in the form:

```js
 {
  inc_vote: newVote
}
```
Where newVote, entered as an integer, indicates how much the votes property in the database will be updated by.

Responds with a JSON object containing a key of `article` with a value of an object containing all information on the requested article, with updated vote count.

E.g.

`PATCH /api/articles/1`
`{ inc_vote: 10 }` Responds with...

```js
{
  "article": {
    author: "butter_bridge",
    title: "Living in the shadow of a great man",
    article_id: 1,
    body: "I find this existence challenging",
    topic: "mitch",
    created_at: "2020-07-09T20:11:00.000Z",
    votes: 110
  }
}
```

### 3. /api/users

### GET

Responds with a JSON object containing a key of `users` with a value of an array containing all of the users objects.

E.g.
```js
{ 
    "users": [
    {
    username: 'butter_bridge',
    name: 'jonny',
    avatar_url:
      'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
    },
    {
    username: 'icellusedkars',
    name: 'sam',
    avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
    },
    {
    username: 'rogersop',
    name: 'paul',
    avatar_url: 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'
    },
    {
    username: 'lurker',
    name: 'do_nothing',
    avatar_url:
      'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
    }
]
}
```

