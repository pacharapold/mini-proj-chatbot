import Public from '@route/Public.router';
import express from 'express';

const router = express.Router();

router.use('/webhook', Public);
export default router;
