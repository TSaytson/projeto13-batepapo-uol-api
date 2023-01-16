import {Router} from 'express';
import {postMessage, getMessages} from '../controllers/messages.controllers.js'
import {messageValidation} from '../middlewares/messages.middlewares.js';

const router = Router();

router.post('/messages', messageValidation, postMessage);
router.get('/messages', getMessages);

export default router;