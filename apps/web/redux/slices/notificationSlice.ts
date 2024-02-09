import { createSlice } from '@reduxjs/toolkit';

// Define a type for the slice state
interface Notification {
	notification: {};
	chatNotification: {};
}

// Define the initial state using that type

const initialState: Notification = {
	notification: null,
	chatNotification: null,
};

export const notificationSlice = createSlice({
	name: 'notification',
	initialState,
	reducers: {
		assignNotification: (state, action) => {
			state.notification = action.payload;
		},
		assignChatNotification: (state, action) => {
			state.chatNotification = action.payload;
		},
	},
});

// Other code such as selectors can use the imported `RootState` type

export const { assignNotification, assignChatNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
