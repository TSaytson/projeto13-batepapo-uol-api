import db from '../database/db.js';
import { messageSchema } from '../models/messages.models.js';

export async function messageValidation(req, res, next){
    const validation = messageSchema.validate(
        req.body, {abortEarly:false}
    );
    const {from} = req.headers;

    if (validation.error){
        const errors = validation.error.details
        .map((detail) => detail.message);
        console.log(errors);
        return res.sendStatus(422);
    }

    const {to, text, type} = req.body;

    if (!to || !text || !type || !from)
        return res.sendStatus(422);

    try {
        const receiverFound = await db.
        collection('participants').findOne({name:to});
        if (!receiverFound)
           return res.sendStatus(422);
        const senderFound = await db.
        collection('participants').findOne({name:from});
        if (!senderFound)
            return res.sendStatus(422);
    } catch(error){
        console.log(error);
        return res.status(500).send(error.message);
    }

    res.locals.message = {
        from,
        to,
        text,
        type,
    }

    next();
}