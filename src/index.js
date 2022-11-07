import express from 'express'
import cors from 'cors'
import { users, tweets } from './mock.js'
import { verifyURL } from './functions.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/sign-up', (req, res) => {
    if (!(req.body.username))
        return res.status(400).send('Todos os campos são obrigatórios');
    if (!verifyURL(req.body.avatar))
        return res.status(400).send('URL inválida');
    users.push(req.body);
    return res.sendStatus(201);
});

app.post('/tweets', (req, res) => {
    if (!req.headers.user) return res.status(400).send('Usuário inválido');
    if (!req.body.tweet) return res.status(400).send('Tweet inválido');
    const tweet = {
        username: req.headers.user,
        tweet: req.body.tweet
    }
    tweets.push(tweet);
    return res.status(201).send('Tweet criado');
});

app.get('/tweets', (req, res) => {
    if (req.query.page < 1)
        return res.status(400).send('Informe uma página válida!');

    tweets.map((tweet) => {
        tweet.avatar = (users.find((user) => user.username === tweet.username)).avatar;
    });

    const lastTweets = [];

    for (let i = 1; i < 11; i++) {
        if(tweets[tweets.length - i])
        lastTweets.push(tweets[tweets.length - i]);
    }
    return res.status(201).send(lastTweets);

});

app.get('/tweets/:USERNAME', (req, res) => {
    const tweetsFrom = tweets.filter((tweet) => tweet.username === req.params.USERNAME);
    if (tweetsFrom.length === 0)
        return res.status(404).send('Usuário sem Tweets');

    return res.status(200).send(tweetsFrom);
})

app.listen(5000, console.log('Running on port 5000'));