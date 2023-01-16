import {Router} from 'express';
import {registerParticipant, getParticipants} from '../controllers/participants.controllers.js'
import {participantValidation} from '../middlewares/participants.middlewares.js';

const router = Router();

router.post('/participants', participantValidation, registerParticipant);
router.get('/participants', getParticipants);

export default router;