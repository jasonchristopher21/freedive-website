import { createSlice } from "@reduxjs/toolkit";
import { User } from "@supabase/supabase-js";

/**
 * Represents the state of the authentication slice.
 */
export interface AuthUserState {
  authUser: User | null; // The authenticated user
}


/**
 * Initial state for the authentication slice
 */
const authInitialState: AuthUserState = {
  authUser: null,
};


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
    // Sets the authenticated user in the state.
    setAuthUser: (state, action) => {
      const authUser = action.payload as User;
      return { ...state, authUser };
    }
  },
});

// Action creators for the authentication slice.
export const { setAuthUser, logout } = authSlice.actions;

/**
 * Selects the authentication token from the state.
 *
 * @param state - The authentication state.
 * @returns The authentication token.
 */
export const selectAuthUser = (state: AuthUserState) => state.authUser;

export default authSlice.reducer;