import { Response } from 'express';
import User from '../models/User.model';
import { AuthRequest } from '../middleware/auth.middleware';

// ADMIN: Get all users
export const getAllUsers = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch {
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
};

// ADMIN: Delete a user
export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }
    res.json({ message: 'User deleted successfully.' });
  } catch {
    res.status(500).json({ message: 'Failed to delete user.' });
  }
};

// ADMIN: Update a user
export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }
    res.json({ message: 'User updated successfully.', user });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to update user';
    res.status(500).json({ message: msg });
  }
};
