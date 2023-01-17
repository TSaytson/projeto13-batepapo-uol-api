import dayjs from "dayjs";
import db from "../database/db.js";

export async function postMessage(req, res) {
    const {from, to, text, type } = res.locals.message;

    try {
        await db.collection('messages')
            .insertOne({
                from,
                to,
                text,
                type,
                time: dayjs().format('HH:mm:ss')
            })
        return res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

export async function getMessages(req, res) {
    const { limit } = req.query;
    const {user} = req.headers;

    try {
        if (Number(limit)) {
            const messages = await db.
                collection('messages').
                find().sort({time:-1})
                .limit(Number(limit)).toArray();
            const allowedMessages = messages
            .filter((message) => 
                (message.type === 'private_message' &&
                message.to === user) || 
                message.type !== 'private_message'
            )
            return res.status(200).send(allowedMessages);
        }
        else {
            const messages = await db.
                collection('messages').
                find().sort({time:-1}).toArray();
            const allowedMessages = messages
            .filter((message) => 
                (message.type === 'private_message' &&
                message.to === user) ||
                message.type !== 'private_message'
            )
            return res.status(200).send(allowedMessages);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
}