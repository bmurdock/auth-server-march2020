const express = require('express');
const jwt = require('jsonwebtoken');

const secret = "mysecret";

// fake blog post data
const posts = [
    {
        author: "Brian",
        title: "Post 1",
    },
    {
        author: "Brian",
        title: "Post 2",
    },
    {
        author: "Dave",
        title: "Post 3",
    },
    {
        author: "Dave",
        title: "Post 4",
    },
];

// define the app
const app = express();
app.use(express.json());

// middleware

function authenticate(req, res, next)
{
    // destructure req object, pull headers out into own variable
    const { headers } = req;

    const { authorization } = headers;

    if (typeof authorization === 'undefined')
    {
        return res.status(401).send('Need token.');
    }
    // should look like: Bearer alsdkfljasldfotokkenalaljsdkf
    // split string on space
    const token = authorization.trim().split(' ')[1];

    if (token === null) {
        return res.status(401).end();
    }
    // we have a token!

    jwt.verify(token,secret,function(err, user)
    {
        if (err)
        {
            return res.status(401).send('Auth error.');
        }
        req.user = user;
        next();
    });
}

// routes

app.get('/posts', authenticate, function(req, res, next)
{
    res.json(posts.filter(function(post)
    {
        return (post.author === req.user.name);
    }));
});

app.post('/login', function(req, res, next)
{
    // authenticate user
    // what you are about to see is fake
    const {username, password} = req.body;
    //validate the password
    if (password !== 'secretpassword')
    {
        return res.status(401).send('Nope!');
    }
    // create the token payload here
    const user = {
        name: username,
    };

    // create the token itself
    const accessToken = jwt.sign(user, secret);
    res.json({accessToken});
})

// listen
app.listen(3182, function(err)
{
    if (err)
    {
        console.log('Mysterious error: ', err);

    }
    console.log('My is listening! port 3182');
});