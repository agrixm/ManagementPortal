import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
  items: [],
  loading: false,
  error: null,
  activeProjectId: ''
};

export const fetchTasks = createAsyncThunk('tasks/fetch', async (query = {}, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams(query).toString();
    const { data } = await api.get(`/tasks${params ? `?${params}` : ''}`);
    return data;
  } catch (error) {
    return rejectWithValue('Failed to load tasks');
  }
});

export const createTask = createAsyncThunk('tasks/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/tasks', payload);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create task');
  }
});

export const patchTaskStatus = createAsyncThunk(
  'tasks/patchStatus',
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/tasks/${taskId}/status`, { status });
      return data;
    } catch (error) {
      return rejectWithValue('Failed to update task status');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setActiveProjectId(state, action) {
      state.activeProjectId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(patchTaskStatus.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      });
  }
});

export const { setActiveProjectId } = taskSlice.actions;
export default taskSlice.reducer;
