import express from 'express'
import cors from 'cors'
import joi from 'joi';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv'
import dayjs from 'dayjs';


const participantSchema = joi.object({
    name: joi.string()
})

const messageSchema = joi.object({
    to: joi.string().required(),
    text: joi.string().required(),
    type: joi.any().allow('message', 'private_message')
})


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect(() => {
    db = mongoClient.db('batepapo-uol');
});


app.post('/participants', async (req, res) => {
    if (!(req.body.name))
        return res.sendStatus(422);
    const participant = req.body;
    const validation = participantSchema.validate(
        (participant)
    )
    if (validation.error) {
        const errors = validation.error.details
            .map((detail) => detail.message);
        console.log(errors);
        return res.sendStatus(422);
    }
    try {
        const participantFound = await db
            .collection('participants')
            .findOne({ name: participant.name });
        if (participantFound)
            return res.sendStatus(409);
        
        await db.collection('participants')
            .insertOne({
                name: participant.name,
                lastStatus: dayjs(Date.now()).format('HH:mm:ss')
            })
        await db.collection('messages')
            .insertOne({
                from: participant,
                to: 'Todos',
                text: 'entra na sala...',
                type: 'status',
                time: dayjs(Date.now()).format('HH:mm:ss')
            })
        res.sendStatus(201);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(422);
    }
});

app.get('/participants', async (req, res) => {
    try {
        const participants = await db
            .collection('participants')
            .find()
            .toArray();
        res.send(participants);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

});

app.post('/messages', async (req, res) => {
    if (!req.headers.user) return res.sendStatus(422);
    if (!req.body.to || !req.body.text || !req.body.type) return res.sendStatus(422);
    
    const validation = messageSchema
        .validate(req.body, { abortEarly: false });
    
    if (validation.error) {
        const errors = validation.error.details
            .map((detail) => detail.message);
        console.log(errors);
        return res.sendStatus(422);
    }

    try {
        const participantFound = await db
            .collection('participants')
            .findOne({ name: req.headers.user });
        if (!participantFound)
            return res.sendStatus(422);
        
        const message = {
            from: req.headers.user,
            to: req.body.to,
            text: req.body.text,
            type: req.body.type,
            time: dayjs(Date.now()).format('HH:mm:ss')
        }

        await db.collection('messages')
            .insertOne(message);
        
        return res.sendStatus(201);
    }

    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/messages', async (req, res) => {
    try {
        const messages = await db
            .collection('messages')
            .find()
            .toArray();
        console.log(messages);
        if (req.query.limit) {
            const limitedMessages = [];
            for (let i = 0; (
                i < messages.length) &&
                (i < req.query.limit);
                i++) {
                limitedMessages.push(messages[i]);
            }
            res.status(200).send(limitedMessages);
        }
        else {
            return res.status(200).send(messages);
        }
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

});


app.post('/status', (req, res) => {

})

app.listen(5000, console.log('Running on port 5000'));