import { createSlice } from '@reduxjs/toolkit';
import { User } from '@prisma/client';
import { Socket } from 'socket.io-client';

// Define a type for the slice state
interface SocketType {
	socket: Socket;
}

// Define the initial state using that type

const initialState: SocketType = {
	socket: {} as Socket,
};

export const socketSlice = createSlice({
	name: 'socket',
	initialState,
	reducers: {
		assignSocket: (state, action) => {
			state.socket = action.payload;
		},
	},
});

// Other code such as selectors can use the imported `RootState` type

export const { assignSocket } = socketSlice.actions;

export default socketSlice.reducer;
