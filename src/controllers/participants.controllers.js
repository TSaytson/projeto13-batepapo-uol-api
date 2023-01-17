import db from '../database/db.js'
import dayjs from 'dayjs';

export async function getParticipants(req, res){
    try{
        const participants = await db.
        collection('participants').find().toArray();
        return res.status(200).send(participants);
    } catch(error){
        console.log(error);
        return res.status(500).send(error.message);
    }

}

export async function registerParticipant(req, res){
    const {name} = res.locals.user;
    try{
        await db.collection('participants').
        insertOne({
            name,
            lastStatus: Date.now()
        });
        await db.collection('messages').insertOne({
            from:name,
            to:'Todos',
            text:'entra na sala...',
            type:'status',
            time: dayjs().format('HH:mm:ss')
        })

        return res.status(201).send('Participante registrado');
    } catch(error){
        console.log(error);
        return res.status(500).send(error.message);
    }
}

export async function updateParticipant(req, res){
    const {user} = req.headers;
    try {
        const userFound = await db
        .collection('participants').findOne({name:user});
        if (!userFound)
            return res.status(404).send('Usuário não encontrado');
        else{
            await db.collection('participants').
            updateOne({name:user}, {$set: {
                lastStatus: Date.now()
            }});
        }
        res.sendStatus(200);
    } catch(error){
        console.log(error);
        return res.status(500).send(error.message);
    }
}