import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import type { ContactModel } from "@/models/ContactModel";

/**
 * Represents the state of the authentication slice.
 */
export interface AuthState {
  token: string;
  role: LoginRole | "";
  user: AdminUser | null;
  isAuthenticated: boolean;
  status: "IDLE" | "LOADING" | "FAILED";
}

/**
 * Represents an admin user
 */
export interface AdminUser {
  id: string;
  staffId: string;
  createdAt: string;
  updatedAt: string;
  contactEmail: string;
//   contact: ContactModel;
}

export enum LoginRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

/**
 * Initial state for the authentication slice
 */
const authInitialState: AuthState = {
  token: "",
  role: "",
  user: null,
  isAuthenticated: false,
  status: "IDLE",
};

/**
 * Represents the arguments for the administrator login action.
 */
interface LoginArguments {
  email: string;
  password: string;
}

/**
 * Represents the response for the administrator login action.
 */
interface AdminLoginResponse {
  access_token: string;
  role: LoginRole | "";
  data: AdminUser;
}

/**
 * Performs an administrator login API request.
 *
 * @param email - The administrator's email.
 * @param password - The administrator's password.
 * @returns A promise that resolves to the login response.
 */
const loginApi = async (email: string, password: string) => {
  const res = await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });    
  const data = await res.json();
  return data;
};

/**
 * Async thunk for administrator login.
 */
export const login = createAsyncThunk<AdminLoginResponse, LoginArguments>(
  "auth/adminLogin",
  async ({ email, password }: { email: string; password: string }) => {
    const res = await loginApi(email, password);
    return { ...res, role: LoginRole.ADMIN };
  },
);

/**
 * The authentication slice for Redux.
 */
const authSlice = createSlice({
  name: "auth",
  initialState: { ...authInitialState },
  reducers: {
    // Logs the user out and resets the authentication state.
    logout: (state) => {
      return { ...authInitialState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        return {
          ...state,
          token: action.payload.access_token,
          role: action.payload.role,
          user: action.payload.data,
          isAuthenticated: true,
          status: "IDLE",
        };
      })
      .addCase(login.pending, (state, action) => {
        return {
          ...state,
          status: "LOADING",
        };
      })
      .addCase(login.rejected, (state, action) => {
        return {
          ...state,
          isAuthenticated: false,
          status: "FAILED",
        };
      });
  },
});

// Action creators for the authentication slice.
export const { logout } = authSlice.actions;

/**
 * Selects the authentication token from the state.
 *
 * @param state - The authentication state.
 * @returns The authentication token.
 */
export const selectToken = (state: AuthState) => state.token;

/**
 * Selects the user role from the state.
 *
 * @param state - The authentication state.
 * @returns The user role.
 */
export const selectRole = (state: AuthState) => state.role;

export default authSlice.reducer;