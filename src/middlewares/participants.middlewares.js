import db from '../database/db.js';
import {participantSchema} from '../models/participants.models.js';


export async function participantValidation(req, res, next){
    const validation = participantSchema.validate(
        req.body, {abortEarly:false}
    )

    if (validation.error){
        const errors = validation.error.details.
        map((detail) => detail.message);
        console.log(errors);
        return res.status(422).send(errors);
    }

    const {name} = req.body;

    try{
        const userFound = await db
        .collection('participants')
        .findOne({name});
        if (userFound)
            return res.status(409).send('Usuário já cadastrado');
    } catch(error){
        console.log(error);
        return res.status(500).send(error.message);
    }

    res.locals.user ={
        name
    }

    next();

}