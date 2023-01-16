import express from 'express';
import cors from 'cors';
import participantsRoutes from './routes/participants.routes.js'
import messagesRoutes from './routes/messages.routes.js';
const app = express();

app.use(express.json());
app.use(cors());
app.use(participantsRoutes);
app.use(messagesRoutes);



app.listen(5000, console.log('Server running on port 5000'));