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

    try {
        const userFound = await db.
        collection('participants').findOne({name:to});
        if (!userFound)
           return res.status(404)
           .send('Destinatário não encontrado');
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