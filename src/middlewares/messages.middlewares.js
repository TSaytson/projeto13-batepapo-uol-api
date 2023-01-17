import db from '../database/db.js';
import { messageSchema } from '../models/messages.models.js';

export async function messageValidation(req, res, next){
    const validation = messageSchema.validate(
        req.body, {abortEarly:false}
    );

    if (validation.error){
        const errors = validation.error.details
        .map((detail) => detail.message);
        console.log(errors);
        return res.status(422).send(errors);
    }

    const {to, text, type} = req.body;
    const {user} = req.headers;
    if (!user)
        return res.status(422).send('Remetente não informado');

    try {
        const receiverFound = await db.
        collection('participants').findOne({name:to});
        if (!receiverFound)
           return res.status(422).send('Destinatário não está na sala');
        const senderFound = await db.
        collection('participants').findOne({name:user});
        if (!senderFound)
            return res.status(422).send('Remetente não está na sala');
    } catch(error){
        console.log(error);
        return res.status(500).send(error.message);
    }

    res.locals.message = {
        from:user,
        to,
        text,
        type,
    }

    next();
}