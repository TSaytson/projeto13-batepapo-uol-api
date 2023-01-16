import {Router} from 'express';
import {registerParticipant, getParticipants, updateParticipant} from '../controllers/participants.controllers.js'
import {participantValidation} from '../middlewares/participants.middlewares.js';

const router = Router();

router.post('/participants', participantValidation, registerParticipant);
router.get('/participants', getParticipants);
router.post('/status', updateParticipant);

export default router;