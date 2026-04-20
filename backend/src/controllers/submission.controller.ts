import { Response } from 'express';
import Submission from '../models/Submission.model';
import { AuthRequest } from '../middleware/auth.middleware';

// USER: Create a new submission
export const createSubmission = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { workDone, status } = req.body;

    if (!workDone || !status) {
      res.status(400).json({ message: 'Work done and status are required.' });
      return;
    }

    if (!['complete', 'incomplete'].includes(status)) {
      res.status(400).json({ message: 'Status must be complete or incomplete.' });
      return;
    }

    const submission = await Submission.create({
      user: req.user!.id,
      userName: req.user!.name,
      workDone,
      status,
      submittedAt: new Date(),
    });

    res.status(201).json({ message: 'Submission created successfully.', submission });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to create submission';
    res.status(500).json({ message: msg });
  }
};

// USER: Get own submissions
export const getMySubmissions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const submissions = await Submission.find({ user: req.user!.id })
      .sort({ submittedAt: -1 });
    res.json({ submissions });
  } catch {
    res.status(500).json({ message: 'Failed to fetch submissions.' });
  }
};

// ADMIN: Get all submissions
export const getAllSubmissions = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const submissions = await Submission.find()
      .populate('user', 'name email')
      .sort({ submittedAt: -1 });
    res.json({ submissions });
  } catch {
    res.status(500).json({ message: 'Failed to fetch submissions.' });
  }
};

// ADMIN: Get single submission
export const getSubmissionById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const submission = await Submission.findById(req.params.id).populate('user', 'name email');
    if (!submission) {
      res.status(404).json({ message: 'Submission not found.' });
      return;
    }
    res.json({ submission });
  } catch {
    res.status(500).json({ message: 'Failed to fetch submission.' });
  }
};

// ADMIN: Update a submission
export const updateSubmission = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { workDone, status, userName } = req.body;

    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      res.status(404).json({ message: 'Submission not found.' });
      return;
    }

    if (workDone !== undefined) submission.workDone = workDone;
    if (status !== undefined) submission.status = status;
    if (userName !== undefined) submission.userName = userName;

    await submission.save();
    res.json({ message: 'Submission updated successfully.', submission });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to update submission';
    res.status(500).json({ message: msg });
  }
};

// ADMIN: Delete a submission
export const deleteSubmission = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const submission = await Submission.findByIdAndDelete(req.params.id);
    if (!submission) {
      res.status(404).json({ message: 'Submission not found.' });
      return;
    }
    res.json({ message: 'Submission deleted successfully.' });
  } catch {
    res.status(500).json({ message: 'Failed to delete submission.' });
  }
};
