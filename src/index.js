import express from 'express';
import cors from 'cors';
import participantsRoutes from './routes/participants.routes.js'
import messagesRoutes from './routes/messages.routes.js';
import db from './database/db.js'
import dayjs from 'dayjs';

const app = express();

app.use(express.json());
app.use(cors());
app.use(participantsRoutes);
app.use(messagesRoutes);

setInterval(async () => {

    try {
        const inactiveParticipants = await db
        .collection('participants').find({
            lastStatus: {$lte: Date.now() - 10000}
        }).toArray();
        if (inactiveParticipants){
            const messages = inactiveParticipants.map(
                (participant) => {
                    return {
                    from: participant.name,
                    to: 'Todos',
                    text: 'Sai da sala...',
                    type: 'status',
                    time: dayjs().format('HH:mm:ss')
                    }
                }
            )
            await db.collection('messages').insertMany(messages);
        }
        await db.collection('participants').deleteMany({
            lastStatus: {$lte: Date.now() - 10000}
        })
    } catch (error){
        console.log(error);
    }

}, 15000)

app.listen(5000, console.log('Server running on port 5000'));