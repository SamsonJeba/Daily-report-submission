import { Router } from 'express';
import {
  createSubmission,
  getMySubmissions,
  getAllSubmissions,
  getSubmissionById,
  updateSubmission,
  deleteSubmission,
} from '../controllers/submission.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', createSubmission);
router.get('/my', getMySubmissions);
router.get('/', authorizeAdmin, getAllSubmissions);
router.get('/:id', authorizeAdmin, getSubmissionById);
router.put('/:id', authorizeAdmin, updateSubmission);
router.delete('/:id', authorizeAdmin, deleteSubmission);

export default router;
