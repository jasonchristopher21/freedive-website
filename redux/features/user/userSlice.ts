import { User } from "@/generated/prisma"
import { createSlice } from "@reduxjs/toolkit";

/**
 * Represents the state of the user slice.
 */
export interface UserState {
  user: User | null; // The authenticated user
}


/**
 * Initial state for the authentication slice
 */
const userInitialState: UserState = {
  user: null,
};


/**
 * The authentication slice for Redux.
 */
const userSlice = createSlice({
  name: "auth",
  initialState: { ...userInitialState },
  reducers: {
    // Logs the user out and resets the authentication state.
    userLogout: (_state, _action: {payload: null, type: string}) => {
      return { ...userInitialState };
    },
    // Sets the authenticated user in the state.
    setUser: (state, action: {payload: User, type: string}) => {
      const user = action.payload as User;
      return { ...state, user };
    }
  },
});

// Action creators for the authentication slice.
export const { setUser, userLogout } = userSlice.actions;

/**
 * Selects the authentication token from the state.
 *
 * @param state - The authentication state.
 * @returns The authentication token.
 */
export const selectUser = (state: UserState) => state.user;

export default userSlice.reducer;