import { createSlice } from '@reduxjs/toolkit';
import { User } from '@prisma/client';

// Define a type for the slice state
interface CurrentUser {
	memberTwo: User;
}

// Define the initial state using that type

const initialState: CurrentUser = {
	memberTwo: null,
};

export const chatSlice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		assignMemberTwo: (state, action) => {
			state.memberTwo = action.payload;
		},
	},
});

// Other code such as selectors can use the imported `RootState` type

export const { assignMemberTwo } = chatSlice.actions;

export default chatSlice.reducer;
