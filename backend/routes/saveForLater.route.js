import express from 'express';
import { saveJobForLater, getSavedJobs, removeSavedJob } from '../controllers/saveForLater.controller.js';
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post('/save-for-later', isAuthenticated, saveJobForLater);
router.get('/saved-jobs', isAuthenticated, getSavedJobs);
router.delete('/saved-jobs/:id', isAuthenticated, removeSavedJob);

export default router;
