import db from '../database/db.js'
import dayjs from 'dayjs';

export async function getParticipants(req, res){
    try{
        const participants = await db.
        collection('participants').find().toArray();
        res.status(200).send(participants);
    } catch(error){
        console.log(error);
        res.status(500).send(error.message);
    }

}

export async function registerParticipant(req, res){
    const {name} = res.locals.user;
    try{
        await db.collection('participants').
        insertOne({
            name,
            lastStatus: dayjs(Date.now()).format('HH:mm:ss')
        });
        await db.collection('messages').insertOne({
            from:name,
            to:'Todos',
            text:'entra na sala...',
            type:'status',
            time: dayjs(Date.now()).format('HH:mm:ss')
        })

        res.status(201).send('Participante registrado');
    } catch(error){
        console.log(error);
        res.status(500).send(error.message);
    }
}