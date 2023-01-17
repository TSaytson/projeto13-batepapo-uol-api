import db from '../database/db.js';
import { messageSchema } from '../models/messages.models.js';

export async function messageValidation(req, res, next){
    const validation = messageSchema.validate(
        req.body, {abortEarly:false}
    );
    const {user} = req.headers;

    if (validation.error){
        const errors = validation.error.details
        .map((detail) => detail.message);
        console.log(errors);
        return res.sendStatus(422);
    }

    const {to, text, type} = req.body;

    try {
        const receiverFound = await db.
        collection('participants').findOne({name:to});
        if (!receiverFound)
           return res.sendStatus(404);
        const senderFound = await db.
        collection('participants').findOne({name:user});
        if (!senderFound)
            return res.sendStatus(404);
    } catch(error){
        console.log(error);
        return res.status(500).send(error.message);
    }

    res.locals.message = {
        to,
        text,
        type,
    }

    next();
}