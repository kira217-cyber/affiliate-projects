import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseURL } from "@/utils/baseURL";

// Async thunk for user login
export const loginUserThunk = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseURL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const responseData = await response.json();

      if (response.ok) {
        const { token, user } = responseData.data;
        localStorage.setItem("token", token);
        return { token, user };
      } else {
        return rejectWithValue(responseData.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for user signup
export const signupUserThunk = createAsyncThunk(
  "auth/signupUser",
  async (credentials, { rejectWithValue }) => {
    console.log("this is credentials", credentials);

    try {
      const response = await fetch(`${baseURL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const responseData = await response.json();

      if (response.ok) {
        const { token, user } = responseData.data;

        console.log("this is token", token);
        

        localStorage.setItem("token", token);
        return { token, user };
      } else {
        return rejectWithValue(responseData.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkTokenThunk = createAsyncThunk(
  "auth/checkToken",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue("Token not found");

    try {
      const response = await fetch(`${baseURL}/check-token`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();

      if (response.ok) {
        const { user, token: newToken } = responseData.data;
        localStorage.setItem("token", newToken);
        return { user, token: newToken };
      } else {
        return rejectWithValue(responseData.message || "Invalid token");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getBalanceThunk = createAsyncThunk(
  "auth/getBalance",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue("Token not found");

    try {
      const userId = getState().auth.user._id;
      const response = await fetch(`${baseURL}/balance`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const responseData = await response.json();

      if (response.ok) {
        return responseData.data;
      } else {
        return rejectWithValue(responseData.message || "Failed to get balance");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBirthdayThunk = createAsyncThunk(
  "auth/updateBirthday",
  async ({ userId, birthday }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue("Token not found");

    try {
      const response = await fetch(`${baseURL}/update-birthday/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ birthday }),
      });

      const responseData = await response.json();

      if (response.ok) {
        return responseData.data;
      } else {
        return rejectWithValue(responseData.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Async thunk for updating username
export const updateUsernameThunk = createAsyncThunk(
  "auth/updateUsername",
  async ({ userId, name }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue("Token not found");

    try {
      const response = await fetch(`${baseURL}/update-username/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const responseData = await response.json();

      if (response.ok) {
        return responseData.data;
      } else {
        return rejectWithValue(responseData.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: false,
  loading: false,
  error: null,
  currency: "BDT",
  tokenLoading: false,
  balanceLoading: false,
  balanceError: null,
  balance: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.balance = null;
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
      state.balanceError = null;
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signupUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(signupUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkTokenThunk.pending, (state) => {
        state.tokenLoading = true;
        state.error = null;
      })
      .addCase(checkTokenThunk.fulfilled, (state, action) => {
        state.tokenLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(checkTokenThunk.rejected, (state, action) => {
        state.tokenLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      })
      .addCase(getBalanceThunk.pending, (state) => {
        state.balanceLoading = true;
        state.balanceError = null;
      })
      .addCase(getBalanceThunk.fulfilled, (state, action) => {
        state.balanceLoading = false;
        state.balance = action.payload;
      })
      .addCase(getBalanceThunk.rejected, (state, action) => {
        state.balanceLoading = false;
        state.balanceError = action.payload;
      })
      .addCase(updateBirthdayThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBirthdayThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateBirthdayThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, setCurrency } = authSlice.actions;
export default authSlice.reducer;