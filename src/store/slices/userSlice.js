"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend-l555.onrender.com";

// Thunk to create a new user
export const createUser = createAsyncThunk(
  "user/createUser",
  async ({ walletAddress, referredBy }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/create`, {
        walletAddress,
        referredBy,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to fetch user details
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (walletAddress, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${walletAddress}`);
      return response.data; // User exists, return data
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // User not found, handle 404 explicitly
        return null; // Return null to indicate user not found
      }
      return rejectWithValue(error.response.data); // Handle other errors
    }
  }
);

// Thunk to add points to a user
export const addPoints = createAsyncThunk(
  "user/addPoints",
  async ({ walletAddress, points }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/points`, {
        walletAddress,
        points,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk to check if all tasks are complete
export const checkAllTasksComplete = createAsyncThunk(
  "user/checkAllTasksComplete",
  async (walletAddress, { rejectWithValue }) => {
    try {
        console.log('initiated');
        
      const response = await axios.post(`${API_BASE_URL}/${walletAddress}/tasks`);
      return response.data; // Returns { allTasksComplete: true/false }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



// Thunk to update user's task status
export const updateUserTaskStatus = createAsyncThunk(
  "user/updateUserTaskStatus",
  async ({ walletAddress, taskId }, { rejectWithValue }) => {
    try {
      const payload = {
        walletAddress,
        taskId,
      };

      console.log("Payload being sent to API:", payload);

      // Log the API URL
      console.log("API Endpoint:", `${API_BASE_URL}/tasks/update`);

      const response = await axios.patch(
        `${API_BASE_URL}/tasks/update`,
        payload
      );

      // Log the successful response
      console.log("API Response:", response.data);

      return response.data;
    } catch (error) {
      // Log detailed error information
      console.error("Error in updateUserTaskStatus:", {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status,
      });

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



const userSlice = createSlice({
  name: "user",
  initialState: {
    data: {
      referralCode: "",
      tasks: [],
      walletAddress: "",
      points: 0,
      allTasksComplete: false,
    },
    loading: false,
    error: null,
  },
  reducers: {
    clearUserState: (state) => {
      state.data = {
        referralCode: "",
        tasks: [],
        walletAddress: "",
        points: 0,
        allTasksComplete: false,
      };
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle createUser
    builder.addCase(createUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle fetchUser
    builder.addCase(fetchUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload) {
        // Populate the state with fetched data
        state.data = {
          referralCode: action.payload.referralCode || "",
          tasks: action.payload.tasks || [],
          walletAddress: action.payload.walletAddress || "",
          points: action.payload.points || 0,
        };
      } else {
        // Handle case where user is not found
        state.data = {
          referralCode: "",
          tasks: [],
          walletAddress: "",
          points: 0,
        };
      }
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle addPoints
    builder.addCase(addPoints.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addPoints.fulfilled, (state, action) => {
      state.loading = false;
      state.data.points = action.payload.points; // Update points
    });
    builder.addCase(addPoints.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle updateUserTaskStatus
    builder.addCase(updateUserTaskStatus.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateUserTaskStatus.fulfilled, (state, action) => {
      state.loading = false;
      state.data.tasks = action.payload.tasks || []; // Update tasks
    });
    builder.addCase(updateUserTaskStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
//check all tasks are complete 
    builder.addCase(checkAllTasksComplete.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(checkAllTasksComplete.fulfilled, (state, action) => {
      state.loading = false;
      state.data.allTasksComplete = action.payload.allTasksComplete;
    });
    builder.addCase(checkAllTasksComplete.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearUserState } = userSlice.actions;

export default userSlice.reducer;
