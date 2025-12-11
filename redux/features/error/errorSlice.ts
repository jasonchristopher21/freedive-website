import { createSlice } from "@reduxjs/toolkit";

/**
 * Represents the state of the error slice.
 */
export interface AuthErrorState {
  isError: boolean,
  message: string,
  response?: Response
}


/**
 * Initial state for the authentication slice
 */
const errorInitialState: AuthErrorState = {
  isError: false,
  message: "",
  response: undefined
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
    setError: (_state, action: {payload: {message: string, response?: Response} | string, type: string}) => {
      if (typeof action.payload === 'string') {
        return { isError: true, message: action.payload }
      }
      return { isError: true, message: action.payload.message, response: action.payload.response };
    }
  },
});

// Action creators for the authentication slice.
export const { closeError, setError } = errorSlice.actions;

export default errorSlice.reducer;