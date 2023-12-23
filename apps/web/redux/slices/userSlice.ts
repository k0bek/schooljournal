import { createSlice } from '@reduxjs/toolkit';
import { User } from '@prisma/client';

// Define a type for the slice state
interface CurrentUser {
	currentUser: User;
}

// Define the initial state using that type

const initialState: CurrentUser = {
	currentUser: null,
};

export const counterSlice = createSlice({
	name: 'currentUser',
	initialState,
	reducers: {
		signInSuccess: (state, action) => {
			state.currentUser = action.payload;
		},
	},
});

// Other code such as selectors can use the imported `RootState` type

export const { signInSuccess } = counterSlice.actions;

export default counterSlice.reducer;
