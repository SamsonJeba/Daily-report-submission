import mongoose, { Document, Schema } from 'mongoose';

export type SubmissionStatus = 'complete' | 'incomplete';

export interface ISubmission extends Document {
  user: mongoose.Types.ObjectId;
  userName: string;
  workDone: string;
  status: SubmissionStatus;
  submittedAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    userName: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
    },
    workDone: {
      type: String,
      required: [true, 'Work description is required'],
      trim: true,
      minlength: [5, 'Work description must be at least 5 characters'],
      maxlength: [1000, 'Work description cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['complete', 'incomplete'],
      required: [true, 'Status is required'],
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
SubmissionSchema.index({ user: 1, submittedAt: -1 });
SubmissionSchema.index({ status: 1 });

export default mongoose.model<ISubmission>('Submission', SubmissionSchema);
