import { createSlice } from "@reduxjs/toolkit";

/**
 * Represents the state of the error slice.
 */
export interface AuthErrorState {
  isError: boolean,
  message: string
}


/**
 * Initial state for the authentication slice
 */
const errorInitialState = {
  isError: false,
  message: ""
}

const errorSlice = createSlice({
  name: "error",
  initialState: errorInitialState,
  reducers: {
    // Closes the modal and resets the error state.
    closeError: (_state, _action: {payload: null, type: string}) => {
      return errorInitialState;
    },
    // Sets the error in the state.
    setError: (state, action: {payload: string, type: string}) => {
      return { isError: true, message: action.payload };
    }
  },
});

// Action creators for the authentication slice.
export const { closeError, setError } = errorSlice.actions;

export default errorSlice.reducer;