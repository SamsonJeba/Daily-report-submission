import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import type { SubmissionState, CreateSubmissionData, UpdateSubmissionData } from '../../types';

const initialState: SubmissionState = {
  submissions: [],
  loading: false,
  error: null,
  successMessage: null,
};

// User: submit daily report
export const createSubmission = createAsyncThunk(
  'submissions/create',
  async (data: CreateSubmissionData, { rejectWithValue }) => {
    try {
      const res = await api.post('/submissions', data);
      return res.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to submit');
    }
  }
);

// User: get own submissions
export const fetchMySubmissions = createAsyncThunk(
  'submissions/fetchMine',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/submissions/my');
      return res.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch');
    }
  }
);

// Admin: get all submissions
export const fetchAllSubmissions = createAsyncThunk(
  'submissions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/submissions');
      return res.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch');
    }
  }
);

// Admin: update submission
export const updateSubmission = createAsyncThunk(
  'submissions/update',
  async ({ id, ...updateData }: UpdateSubmissionData, { rejectWithValue }) => {
    try {
      const res = await api.put(`/submissions/${id}`, updateData);
      return res.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to update');
    }
  }
);

// Admin: delete submission
export const deleteSubmission = createAsyncThunk(
  'submissions/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/submissions/${id}`);
      return id;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to delete');
    }
  }
);

const submissionSlice = createSlice({
  name: 'submissions',
  initialState,
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state: SubmissionState) => { state.loading = true; state.error = null; state.successMessage = null; };
    const rejected = (state: SubmissionState, action: { payload: unknown }) => {
      state.loading = false;
      state.error = action.payload as string;
    };

    // Create
    builder.addCase(createSubmission.pending, pending);
    builder.addCase(createSubmission.fulfilled, (state, action) => {
      state.loading = false;
      state.submissions.unshift(action.payload.submission);
      state.successMessage = 'Report submitted successfully!';
    });
    builder.addCase(createSubmission.rejected, rejected);

    // Fetch mine
    builder.addCase(fetchMySubmissions.pending, pending);
    builder.addCase(fetchMySubmissions.fulfilled, (state, action) => {
      state.loading = false;
      state.submissions = action.payload.submissions;
    });
    builder.addCase(fetchMySubmissions.rejected, rejected);

    // Fetch all (admin)
    builder.addCase(fetchAllSubmissions.pending, pending);
    builder.addCase(fetchAllSubmissions.fulfilled, (state, action) => {
      state.loading = false;
      state.submissions = action.payload.submissions;
    });
    builder.addCase(fetchAllSubmissions.rejected, rejected);

    // Update
    builder.addCase(updateSubmission.pending, pending);
    builder.addCase(updateSubmission.fulfilled, (state, action) => {
      state.loading = false;
      const idx = state.submissions.findIndex(s => s._id === action.payload.submission._id);
      if (idx !== -1) state.submissions[idx] = action.payload.submission;
      state.successMessage = 'Submission updated!';
    });
    builder.addCase(updateSubmission.rejected, rejected);

    // Delete
    builder.addCase(deleteSubmission.pending, pending);
    builder.addCase(deleteSubmission.fulfilled, (state, action) => {
      state.loading = false;
      state.submissions = state.submissions.filter(s => s._id !== action.payload);
      state.successMessage = 'Submission deleted!';
    });
    builder.addCase(deleteSubmission.rejected, rejected);
  },
});

export const { clearMessages } = submissionSlice.actions;
export default submissionSlice.reducer;
